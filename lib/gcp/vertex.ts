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

/**
 * Generate an embedding vector for a piece of text using
 * Vertex AI's text-embedding-004 model. Returns a 768-dim vector.
 *
 * We hit the REST endpoint directly because the @google-cloud/vertexai
 * SDK does not expose embeddings yet (as of v1.9). Authentication is
 * picked up from GOOGLE_APPLICATION_CREDENTIALS automatically.
 */
export async function embedText(text: string): Promise<number[]> {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const accessToken = await auth.getAccessToken();

  const url =
    `https://${gcpConfig.location}-aiplatform.googleapis.com/v1/projects/` +
    `${gcpConfig.projectId}/locations/${gcpConfig.location}/publishers/google/` +
    `models/${gcpConfig.embeddingModel}:predict`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ content: text, task_type: 'RETRIEVAL_QUERY' }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    predictions: Array<{ embeddings: { values: number[] } }>;
  };
  const embedding = data.predictions?.[0]?.embeddings?.values;
  if (!embedding) {
    throw new Error('Embedding response missing values');
  }
  return embedding;
}

/**
 * Embed a knowledge-base chunk for storage. The only difference from
 * embedText is the task_type hint, which lets the model produce a
 * vector optimised for indexing rather than querying.
 */
export async function embedDocument(text: string): Promise<number[]> {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const accessToken = await auth.getAccessToken();

  const url =
    `https://${gcpConfig.location}-aiplatform.googleapis.com/v1/projects/` +
    `${gcpConfig.projectId}/locations/${gcpConfig.location}/publishers/google/` +
    `models/${gcpConfig.embeddingModel}:predict`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ content: text, task_type: 'RETRIEVAL_DOCUMENT' }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    predictions: Array<{ embeddings: { values: number[] } }>;
  };
  const embedding = data.predictions?.[0]?.embeddings?.values;
  if (!embedding) {
    throw new Error('Embedding response missing values');
  }
  return embedding;
}
