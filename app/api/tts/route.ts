/**
 * Text-to-Speech endpoint.
 *
 * POST /api/tts  { text: string, locale?: 'en' | 'hi' }
 *   → { audio: base64 mp3, mimeType: 'audio/mpeg' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeech, type TtsLocale } from '@/lib/gcp/tts';

export const runtime = 'nodejs';

const MAX_TEXT_LENGTH = 5000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { text?: unknown; locale?: unknown };

    if (typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }
    const text = body.text.slice(0, MAX_TEXT_LENGTH);
    const locale: TtsLocale = body.locale === 'hi' ? 'hi' : 'en';

    const result = await synthesizeSpeech(text, locale);
    return NextResponse.json({ audio: result.audioContent, mimeType: result.mimeType });
  } catch (err) {
    console.error('[tts] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'TTS failed' },
      { status: 500 },
    );
  }
}
