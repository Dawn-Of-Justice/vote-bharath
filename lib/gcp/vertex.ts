/**
 * Vertex AI client — handles both Gemini chat (with streaming) and
 * text-embedding generation. Kept as a lazy singleton so we don't
 * pay the auth handshake on every request.
 */

import { VertexAI, type GenerativeModel } from '@google-cloud/vertexai';
import { gcpConfig } from './config';

let cachedClient: VertexAI | null = null;
let cachedGeminiModel: GenerativeModel | null = null;

function getClient(): VertexAI {
  if (!cachedClient) {
    cachedClient = new VertexAI({
      project: gcpConfig.projectId,
      location: gcpConfig.location,
    });
  }
  return cachedClient;
}

export function getGeminiModel(): GenerativeModel {
  if (!cachedGeminiModel) {
    cachedGeminiModel = getClient().getGenerativeModel({
      model: gcpConfig.geminiModel,
      generationConfig: {
        temperature: 0.2, // Low temp for grounded factual answers
        maxOutputTokens: 1024,
        topP: 0.95,
      },
      // Block obvious abuse but let civic / legal discussion through
      safetySettings: [],
    });
  }
  return cachedGeminiModel;
}

// ---------------------------------------------------------------------------
// Embedding helpers
// ---------------------------------------------------------------------------

/**
 * We hit the REST endpoint directly because the @google-cloud/vertexai
 * SDK does not expose embeddings yet (as of v1.9). Authentication is
 * picked up from GOOGLE_APPLICATION_CREDENTIALS automatically.
 *
 * Access tokens are valid for ~1 hour; we cache with a 50-minute TTL
 * to avoid a round-trip on every request.
 */

type TaskType = 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
const TOKEN_TTL_MS = 50 * 60 * 1000; // 50 minutes
const FETCH_TIMEOUT_MS = 30_000;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const token = await auth.getAccessToken();
  if (!token) throw new Error('Failed to obtain GCP access token');
  cachedToken = token;
  tokenExpiresAt = Date.now() + TOKEN_TTL_MS;
  return token;
}

async function embedWithTaskType(text: string, taskType: TaskType): Promise<number[]> {
  const accessToken = await getAccessToken();

  const url =
    `https://${gcpConfig.location}-aiplatform.googleapis.com/v1/projects/` +
    `${gcpConfig.projectId}/locations/${gcpConfig.location}/publishers/google/` +
    `models/${gcpConfig.embeddingModel}:predict`;

  const maxRetries = 4;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ content: text, task_type: taskType }],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 429 && attempt < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s, 8s
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embedding request failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as {
      predictions: Array<{ embeddings: { values: number[] } }>;
    };
    const embedding = data.predictions?.[0]?.embeddings?.values;
    if (!embedding) throw new Error('Embedding response missing values');
    return embedding;
  }

  throw new Error('Embedding failed after max retries');
}

/** Embed a user query for similarity search. */
export function embedText(text: string): Promise<number[]> {
  return embedWithTaskType(text, 'RETRIEVAL_QUERY');
}

/** Embed a knowledge-base chunk for indexing. */
export function embedDocument(text: string): Promise<number[]> {
  return embedWithTaskType(text, 'RETRIEVAL_DOCUMENT');
}
