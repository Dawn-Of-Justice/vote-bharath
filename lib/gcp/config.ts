/**
 * Centralised GCP config. All env access happens here so we get one
 * helpful error if something is missing rather than five cryptic ones.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check your .env.local against .env.example.`,
    );
  }
  return value;
}

export const gcpConfig = {
  projectId: required('GCP_PROJECT_ID'),
  location: process.env.GCP_LOCATION ?? 'asia-south1',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'text-embedding-004',
  kbCollection: process.env.KB_COLLECTION ?? 'knowledge_base',
} as const;
