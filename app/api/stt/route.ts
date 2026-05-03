/**
 * Speech-to-Text endpoint.
 *
 * POST /api/stt  multipart/form-data
 *   audio: Blob (webm/opus or mp3)
 *   locale: 'en' | 'hi'
 *
 *   → { transcript: string }
 *
 * Browser MediaRecorder typically produces webm/opus on Chrome/Firefox
 * and mp4/aac on Safari. We detect from MIME type and fall back to
 * WEBM_OPUS as the safer default.
 */

import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio, type SttLocale } from '@/lib/gcp/stt';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const audio = form.get('audio');
    const localeRaw = form.get('locale');

    if (!(audio instanceof Blob)) {
      return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });
    }

    const locale: SttLocale = localeRaw === 'hi' ? 'hi' : 'en';
    const buffer = Buffer.from(await audio.arrayBuffer());
    const base64 = buffer.toString('base64');

    const encoding = audio.type.includes('mp3')
      ? 'MP3'
      : audio.type.includes('wav')
        ? 'LINEAR16'
        : 'WEBM_OPUS';

    const transcript = await transcribeAudio(base64, locale, encoding);
    return NextResponse.json({ transcript });
  } catch (err) {
    console.error('[stt] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'STT failed' },
      { status: 500 },
    );
  }
}
