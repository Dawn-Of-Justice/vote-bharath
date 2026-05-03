/**
 * Cloud Speech-to-Text wrapper. Accepts a base64-encoded audio blob
 * captured from the browser MediaRecorder API and returns a transcript.
 *
 * We use the v2 recognize API with the long-form model since voters
 * may pause and think mid-question.
 */

import speech from '@google-cloud/speech';
import type { protos } from '@google-cloud/speech';

let cachedClient: ReturnType<typeof speech.SpeechClient> | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = new speech.SpeechClient();
  }
  return cachedClient;
}

export type SttLocale = 'en' | 'hi';

const LANGUAGE_BY_LOCALE: Record<SttLocale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
};

/**
 * Transcribe a short (under ~60s) audio clip. Browser MediaRecorder
 * typically produces webm/opus on Chrome and audio/mp4 on Safari, so
 * we accept either via the encoding param.
 */
export async function transcribeAudio(
  audioBase64: string,
  locale: SttLocale = 'en',
  encoding: 'WEBM_OPUS' | 'MP3' | 'LINEAR16' = 'WEBM_OPUS',
): Promise<string> {
  if (!audioBase64) {
    throw new Error('Cannot transcribe empty audio');
  }

  const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
    audio: { content: audioBase64 },
    config: {
      encoding,
      languageCode: LANGUAGE_BY_LOCALE[locale],
      // For Hindi, also accept English (code-mixing is very common in India)
      alternativeLanguageCodes: locale === 'hi' ? ['en-IN'] : undefined,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    },
  };

  const [response] = await getClient().recognize(request);
  const transcript =
    response.results
      ?.map((r) => r.alternatives?.[0]?.transcript ?? '')
      .filter(Boolean)
      .join(' ')
      .trim() ?? '';

  return transcript;
}
