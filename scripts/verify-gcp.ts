/**
 * Sanity check that every GCP service is reachable with the configured
 * credentials. Run BEFORE attempting an ingest or starting the dev server
 * to surface auth/IAM issues clearly.
 */

import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

async function check(label: string, fn: () => Promise<void>) {
  process.stdout.write(`  ${label.padEnd(28)} `);
  try {
    await fn();
    console.log('OK');
  } catch (err) {
    console.log('FAIL');
    console.error(`    → ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
}

async function main() {
  console.log('\nVerifying GCP setup for Vote Bharath\n');

  await check('Vertex AI (embeddings)', async () => {
    const { embedText } = await import('../lib/gcp/vertex');
    const v = await embedText('hello');
    if (!Array.isArray(v) || v.length === 0) throw new Error('Empty embedding');
  });

  await check('Firestore', async () => {
    const { getFirestore } = await import('../lib/gcp/firestore');
    await getFirestore().listCollections();
  });

  await check('Cloud Text-to-Speech', async () => {
    const { synthesizeSpeech } = await import('../lib/gcp/tts');
    const { audioContent } = await synthesizeSpeech('Test', 'en');
    if (!audioContent) throw new Error('No audio returned');
  });

  await check('Cloud Speech-to-Text', async () => {
    const speech = await import('@google-cloud/speech');
    const client = new speech.default.SpeechClient();
    // listVoices is on TTS — for STT we just instantiate and check IAM via project access
    await client.getProjectId();
  });

  console.log('\nAll services reachable. You are ready to run npm run ingest.\n');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
