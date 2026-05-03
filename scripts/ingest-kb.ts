/**
 * Ingest the knowledge base into Firestore.
 *
 * Reads every .md file in data/knowledge-base, parses the frontmatter,
 * splits the body into chunks, embeds each chunk with text-embedding-004,
 * and writes the result to the Firestore knowledge_base collection.
 *
 * Run with:  npm run ingest
 *
 * Idempotent: chunk IDs are deterministic (filename + chunk index), so
 * rerunning overwrites existing chunks rather than duplicating them.
 */

import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

interface Frontmatter {
  title: string;
  topic: string;
  sourceUrl?: string;
}

const KB_DIR = join(process.cwd(), 'data', 'knowledge-base');

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedWithRetry(
  embedDocument: (text: string) => Promise<number[]>,
  text: string,
  retries = 5,
): Promise<number[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await embedDocument(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('429') && attempt < retries) {
        const waitMs = 5000 * Math.pow(2, attempt); // 5s, 10s, 20s, 40s, 80s
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

async function ingest() {
  // Dynamic imports so they evaluate after loadEnv has populated process.env
  const { embedDocument } = await import('../lib/gcp/vertex');
  const { upsertChunk } = await import('../lib/gcp/firestore');
  const { chunkMarkdown } = await import('../lib/rag/chunker');

  const files = readdirSync(KB_DIR).filter((f) => f.endsWith('.md'));
  console.log(`Found ${files.length} knowledge base files\n`);

  let totalChunks = 0;
  let failures = 0;

  for (const file of files) {
    const raw = readFileSync(join(KB_DIR, file), 'utf-8');
    const parsed = matter(raw);
    const fm = parsed.data as Frontmatter;
    const chunks = chunkMarkdown(parsed.content);

    process.stdout.write(`  ${file}  →  ${chunks.length} chunks  `);

    for (const chunk of chunks) {
      try {
        const embedding = await embedWithRetry(embedDocument, chunk.content);
        // 1.1s delay → ~54 QPM, safely under the default 60 QPM quota on new projects
        await sleep(1100);
        await upsertChunk({
          id: `${file.replace('.md', '')}__${chunk.chunkIndex}`,
          content: chunk.content,
          source: file,
          title: fm.title,
          topic: fm.topic,
          sourceUrl: fm.sourceUrl,
          chunkIndex: chunk.chunkIndex,
          embedding,
        });
        process.stdout.write('.');
        totalChunks++;
      } catch (err) {
        process.stdout.write('x');
        failures++;
        console.error(`\n  Failed chunk ${chunk.chunkIndex} of ${file}:`, err);
      }
    }
    process.stdout.write('\n');
  }

  console.log(`\nDone. ${totalChunks} chunks indexed, ${failures} failures.`);
  if (failures > 0) process.exit(1);
}

ingest().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
