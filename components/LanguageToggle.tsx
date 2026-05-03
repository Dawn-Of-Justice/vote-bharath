'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.common.languageToggle}
      className="inline-flex items-center rounded-full border border-ink-200 bg-white p-1 text-sm shadow-sm"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === 'en'
            ? 'bg-saffron-500 text-white'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('hi')}
        aria-pressed={locale === 'hi'}
        lang="hi"
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === 'hi'
            ? 'bg-saffron-500 text-white'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        हिं
      </button>
    </div>
  );
}
