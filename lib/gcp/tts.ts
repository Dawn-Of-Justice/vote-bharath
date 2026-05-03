/**
 * Cloud Text-to-Speech wrapper. Returns a base64-encoded MP3 the
 * client can play directly via an <audio> element.
 *
 * Voice selection uses Google's Neural2 voices for natural prosody.
 * Indian English and Hindi voices are picked based on locale.
 */

import textToSpeech from '@google-cloud/text-to-speech';
import type { protos } from '@google-cloud/text-to-speech';

let cachedClient: InstanceType<
  typeof textToSpeech.TextToSpeechClient
> | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = new textToSpeech.TextToSpeechClient();
  }
  return cachedClient;
}

export type TtsLocale = 'en' | 'hi';

const VOICE_BY_LOCALE: Record<
  TtsLocale,
  { languageCode: string; name: string }
> = {
  // Indian English Neural2 voice — clear, natural, regionally appropriate
  en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
  // Hindi Neural2 voice
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
};

export async function synthesizeSpeech(
  text: string,
  locale: TtsLocale = 'en',
): Promise<{ audioContent: string; mimeType: 'audio/mpeg' }> {
  if (!text.trim()) {
    throw new Error('Cannot synthesize empty text');
  }
  if (text.length > 5000) {
    // TTS API hard limit is 5000 chars per request
    text = text.slice(0, 5000);
  }

  const voice = VOICE_BY_LOCALE[locale];
  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text },
    voice: { ...voice, ssmlGender: 'FEMALE' },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0,
    },
  };

  const [response] = await getClient().synthesizeSpeech(request);
  const audio = response.audioContent;
  if (!audio) {
    throw new Error('TTS response missing audio content');
  }

  // The SDK returns Buffer | Uint8Array | string; normalise to base64
  const audioContent =
    typeof audio === 'string'
      ? audio
      : Buffer.from(audio as Uint8Array).toString('base64');

  return { audioContent, mimeType: 'audio/mpeg' };
}
