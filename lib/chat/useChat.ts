'use client';

/**
 * Chat hook that owns the message list and handles streaming SSE
 * responses from /api/chat. Each message can carry sources retrieved
 * from the RAG layer.
 */

import { useCallback, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/strings';

const SSE_DELIMITER = '\n\n';
const EVENT_PREFIX = 'event: ';
const DATA_PREFIX = 'data: ';

export interface ChatSource {
  title: string;
  topic: string;
  sourceUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  isStreaming?: boolean;
  isError?: boolean;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat(locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isResponding) return;

      const userMsg: ChatMessage = {
        id: newId(),
        role: 'user',
        content: trimmed,
      };
      const assistantId = newId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsResponding(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, locale }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Server returned ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE messages are separated by blank lines
          const events = buffer.split(SSE_DELIMITER);
          buffer = events.pop() ?? '';

          for (const evt of events) {
            const lines = evt.split('\n');
            const eventLine = lines.find((l) => l.startsWith(EVENT_PREFIX));
            const dataLine = lines.find((l) => l.startsWith(DATA_PREFIX));
            if (!eventLine || !dataLine) continue;

            const eventType = eventLine.slice(EVENT_PREFIX.length).trim();
            const data = dataLine.slice(DATA_PREFIX.length);

            if (eventType === 'sources') {
              try {
                const sources = JSON.parse(data) as ChatSource[];
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, sources } : m,
                  ),
                );
              } catch {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[chat] malformed sources frame:', data);
                }
              }
            } else if (eventType === 'chunk') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data }
                    : m,
                ),
              );
            } else if (eventType === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: data, isError: true, isStreaming: false }
                    : m,
                ),
              );
            } else if (eventType === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m,
                ),
              );
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: err instanceof Error ? err.message : 'Error',
                  isError: true,
                  isStreaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsResponding(false);
        abortRef.current = null;
      }
    },
    [isResponding, locale],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, sendMessage, isResponding, cancel };
}
