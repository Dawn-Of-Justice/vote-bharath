/**
 * Firestore client + vector search helpers.
 *
 * We use Firestore's native vector search (GA in 2024). Each KB chunk is
 * stored as a document with: { content, source, embedding (Vector), metadata }.
 * The findNearest call returns the K most semantically similar chunks for
 * a query embedding using cosine distance.
 */

import { Firestore, FieldValue } from '@google-cloud/firestore';
import { gcpConfig } from './config';

let cachedFirestore: Firestore | null = null;

export function getFirestore(): Firestore {
  if (!cachedFirestore) {
    cachedFirestore = new Firestore({
      projectId: gcpConfig.projectId,
      databaseId: '(default)',
    });
    // Ignore undefined fields rather than throwing — friendlier for partial writes
    cachedFirestore.settings({ ignoreUndefinedProperties: true });
  }
  return cachedFirestore;
}

export interface KbChunk {
  id: string;
  content: string;
  source: string;
  title: string;
  topic: string;
  sourceUrl?: string;
  chunkIndex: number;
}

export interface KbChunkWithEmbedding extends KbChunk {
  embedding: number[];
}

/** Write a single chunk document (used by the ingestion script). */
export async function upsertChunk(chunk: KbChunkWithEmbedding): Promise<void> {
  const db = getFirestore();
  await db.collection(gcpConfig.kbCollection).doc(chunk.id).set({
    content: chunk.content,
    source: chunk.source,
    title: chunk.title,
    topic: chunk.topic,
    sourceUrl: chunk.sourceUrl ?? null,
    chunkIndex: chunk.chunkIndex,
    embedding: FieldValue.vector(chunk.embedding),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Vector search: return the K most similar chunks to the query embedding.
 *
 * Note: requires a vector index on the `embedding` field. Create with:
 *   gcloud firestore indexes composite create \
 *     --collection-group=knowledge_base \
 *     --query-scope=COLLECTION \
 *     --field-config=vector-config='{"dimension":768,"flat":{}}',field-path=embedding
 */
export async function findSimilarChunks(
  queryEmbedding: number[],
  topK = 5,
): Promise<KbChunk[]> {
  const db = getFirestore();
  const collection = db.collection(gcpConfig.kbCollection);

  const snapshot = await collection
    .findNearest({
      vectorField: 'embedding',
      queryVector: FieldValue.vector(queryEmbedding),
      limit: topK,
      distanceMeasure: 'COSINE',
    })
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      content: data.content as string,
      source: data.source as string,
      title: data.title as string,
      topic: data.topic as string,
      sourceUrl: (data.sourceUrl as string | null) ?? undefined,
      chunkIndex: data.chunkIndex as number,
    };
  });
}
