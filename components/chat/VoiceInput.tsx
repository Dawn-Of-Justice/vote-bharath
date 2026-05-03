'use client';

import { useRef, useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/strings';

interface Props {
  locale: Locale;
  onTranscript: (text: string) => void;
  ariaLabel: string;
  listeningLabel: string;
  disabled?: boolean;
}

export function VoiceInput({
  locale,
  onTranscript,
  ariaLabel,
  listeningLabel,
  disabled,
}: Props) {
  const [state, setState] = useState<'idle' | 'recording' | 'transcribing'>(
    'idle',
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // Pick the best supported MIME type for the browser
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopStream();
        setState('transcribing');
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const form = new FormData();
          form.append('audio', blob, `recording.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
          form.append('locale', locale);

          const res = await fetch('/api/stt', { method: 'POST', body: form });
          if (!res.ok) throw new Error(`STT failed ${res.status}`);
          const { transcript } = (await res.json()) as { transcript: string };
          if (transcript.trim()) onTranscript(transcript);
        } catch (err) {
          console.error('Transcription failed:', err);
        } finally {
          setState('idle');
        }
      };

      recorder.start();
      setState('recording');
    } catch (err) {
      console.error('Mic access denied:', err);
      stopStream();
      setState('idle');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleClick = () => {
    if (state === 'recording') stopRecording();
    else if (state === 'idle') startRecording();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || state === 'transcribing'}
      aria-label={state === 'recording' ? listeningLabel : ariaLabel}
      aria-pressed={state === 'recording'}
      title={state === 'recording' ? listeningLabel : ariaLabel}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 disabled:cursor-not-allowed disabled:opacity-50 ${
        state === 'recording'
          ? 'animate-pulse bg-red-500 text-white hover:bg-red-600'
          : 'bg-ink-100 text-ink-800 hover:bg-ink-200'
      }`}
    >
      {state === 'transcribing' ? (
        <Loader2 size={18} className="animate-spin" aria-hidden />
      ) : state === 'recording' ? (
        <Square size={16} aria-hidden />
      ) : (
        <Mic size={18} aria-hidden />
      )}
    </button>
  );
}
