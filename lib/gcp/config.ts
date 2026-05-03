/**
 * Centralised GCP config. All env access happens here so we get one
 * helpful error if something is missing rather than five cryptic ones.
 *
 * Values are read lazily (via getters) so that importing this module at
 * Next.js build time does not throw — validation only fires when a value
 * is actually accessed at runtime.
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
  get projectId() { return required('GCP_PROJECT_ID'); },
  get location() { return process.env.GCP_LOCATION ?? 'asia-south1'; },
  get geminiModel() { return process.env.GEMINI_MODEL ?? 'gemini-1.5-flash'; },
  get embeddingModel() { return process.env.EMBEDDING_MODEL ?? 'text-embedding-004'; },
  get kbCollection() { return process.env.KB_COLLECTION ?? 'knowledge_base'; },
};
