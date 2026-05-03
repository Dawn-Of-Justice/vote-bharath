'use client';

import { ExternalLink, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '@/lib/chat/useChat';
import type { Locale } from '@/lib/i18n/strings';
import { ListenButton } from './ListenButton';

interface Props {
  message: ChatMessage;
  locale: Locale;
  sourcesLabel: string;
  listenLabel: string;
  stopLabel: string;
}

export function MessageBubble({
  message,
  locale,
  sourcesLabel,
  listenLabel,
  stopLabel,
}: Props) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      role="group"
      aria-label={isUser ? 'Your message' : 'Assistant message'}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-saffron-500 text-white'
            : message.isError
              ? 'bg-red-50 text-red-900 border border-red-200'
              : 'bg-white border border-ink-200 text-ink-900'
        }`}
      >
        {message.isError && (
          <div className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
            <AlertCircle size={12} aria-hidden />
            Error
          </div>
        )}

        <p
          lang={locale}
          className="whitespace-pre-wrap break-words text-sm leading-relaxed"
        >
          {message.content}
          {message.isStreaming && (
            <span
              aria-hidden
              className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-current align-middle"
            />
          )}
        </p>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-ink-200 pt-2">
            <p
              lang={locale}
              className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-600"
            >
              {sourcesLabel}
            </p>
            <ul className="space-y-1">
              {message.sources.map((source, i) => (
                <li key={`${source.title}-${i}`} className="text-xs text-ink-600">
                  {source.sourceUrl ? (
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-saffron-700 hover:underline"
                    >
                      [{i + 1}] {source.title}
                      <ExternalLink size={10} aria-hidden />
                    </a>
                  ) : (
                    <span>
                      [{i + 1}] {source.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TTS button shown only for completed assistant messages */}
        {!isUser &&
          !message.isStreaming &&
          !message.isError &&
          message.content && (
            <div className="mt-2 flex justify-end">
              <ListenButton
                text={message.content}
                locale={locale}
                ariaLabel={listenLabel}
                stopLabel={stopLabel}
              />
            </div>
          )}
      </div>
    </div>
  );
}
