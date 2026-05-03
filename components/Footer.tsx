'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function Footer() {
  const { locale } = useLanguage();

  return (
    <footer className="mt-12 border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-ink-600 sm:px-6 lg:px-8">
        <p lang={locale}>
          {locale === 'hi'
            ? 'वोट भारत — Election Process Education हैकाथॉन के लिए बनाया गया। Google Cloud पर निर्मित।'
            : 'Vote Bharath — Built for the Election Process Education hackathon. Powered by Google Cloud.'}
        </p>
        <p className="mt-2 text-xs text-ink-600">
          {locale === 'hi'
            ? 'यह एक शैक्षिक उपकरण है। आधिकारिक मार्गदर्शन के लिए ECI (eci.gov.in) देखें।'
            : 'Educational tool. For official guidance, visit ECI (eci.gov.in).'}
        </p>
      </div>
    </footer>
  );
}
