'use client';

import { useRef, useState } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/strings';

interface Props {
  text: string;
  locale: Locale;
  ariaLabel: string;
  stopLabel: string;
}

export function ListenButton({ text, locale, ariaLabel, stopLabel }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setState('idle');
  };

  const play = async () => {
    if (state !== 'idle') {
      stop();
      return;
    }
    setState('loading');
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale }),
      });
      if (!res.ok) throw new Error(`TTS error ${res.status}`);
      const { audio, mimeType } = (await res.json()) as {
        audio: string;
        mimeType: string;
      };
      const audioEl = new Audio(`data:${mimeType};base64,${audio}`);
      audioRef.current = audioEl;
      audioEl.onended = () => setState('idle');
      audioEl.onerror = () => setState('idle');
      await audioEl.play();
      setState('playing');
    } catch (err) {
      console.error('TTS playback failed:', err);
      setState('idle');
    }
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={state === 'playing' ? stopLabel : ariaLabel}
      title={state === 'playing' ? stopLabel : ariaLabel}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
    >
      {state === 'loading' ? (
        <Loader2 size={16} className="animate-spin" aria-hidden />
      ) : state === 'playing' ? (
        <Square size={16} aria-hidden />
      ) : (
        <Volume2 size={16} aria-hidden />
      )}
    </button>
  );
}
