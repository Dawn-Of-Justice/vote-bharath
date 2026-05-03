'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useChat } from '@/lib/chat/useChat';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { VoiceInput } from '@/components/chat/VoiceInput';

export default function AskPage() {
  const { t, locale } = useLanguage();
  const { messages, sendMessage, isResponding } = useChat(locale);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;
    sendMessage(input);
    setInput('');
  };

  const handleSuggestion = (text: string) => {
    if (isResponding) return;
    sendMessage(text);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4 py-6">
      <header>
        <h1 lang={locale} className="text-2xl font-bold text-ink-900 sm:text-3xl">
          {t.ask.title}
        </h1>
        <p lang={locale} className="mt-1 text-sm text-ink-600">
          {t.ask.subtitle}
        </p>
      </header>

      {/* Messages area */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-ink-200 bg-ink-50/60 p-4 sm:p-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-saffron-400 to-democracy-green text-white"
              aria-hidden
            >
              <Sparkles size={20} />
            </div>
            <p
              lang={locale}
              className="mb-4 max-w-md text-sm text-ink-600"
            >
              {t.ask.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {t.ask.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  lang={locale}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-800 transition-colors hover:border-saffron-300 hover:bg-saffron-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              locale={locale}
              sourcesLabel={t.ask.sourcesLabel}
              listenLabel={t.ask.listenLabel}
              stopLabel={t.ask.stopLabel}
            />
          ))
        )}
      </div>

      {/* Input row */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-sm focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-100"
      >
        <VoiceInput
          locale={locale}
          onTranscript={(text) => setInput(text)}
          ariaLabel={t.ask.micLabel}
          listeningLabel={t.ask.listening}
          disabled={isResponding}
        />
        <label htmlFor="ask-input" className="sr-only">
          {t.ask.placeholder}
        </label>
        <input
          id="ask-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.ask.placeholder}
          lang={locale}
          maxLength={500}
          autoComplete="off"
          disabled={isResponding}
          className="flex-1 bg-transparent px-2 text-sm text-ink-900 placeholder:text-ink-600 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isResponding}
          aria-label={t.ask.send}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500 text-white transition-colors hover:bg-saffron-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={16} aria-hidden />
        </button>
      </form>
    </div>
  );
}
