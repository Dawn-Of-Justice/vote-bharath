'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { timeline } from '@/data/timeline';
import { PhaseCard } from '@/components/timeline/PhaseCard';
import { Users, Clock } from 'lucide-react';

export default function TimelinePage() {
  const { t, locale } = useLanguage();
  const [activeId, setActiveId] = useState<string>(timeline[0]?.id ?? '');
  const activePhase = timeline.find((p) => p.id === activeId) ?? timeline[0];

  return (
    <div className="space-y-8 py-6">
      <header>
        <h1 lang={locale} className="text-2xl font-bold text-ink-900 sm:text-3xl">
          {t.timeline.title}
        </h1>
        <p lang={locale} className="mt-2 text-ink-600">
          {t.timeline.subtitle}
        </p>
      </header>

      {/* Horizontal scrollable phase track */}
      <div
        role="tablist"
        aria-label={t.timeline.title}
        className="timeline-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {timeline.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isActive={phase.id === activeId}
            onClick={() => setActiveId(phase.id)}
          />
        ))}
      </div>

      {/* Detail panel for the active phase */}
      <AnimatePresence mode="wait">
        {activePhase && (
          <motion.section
            key={activePhase.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
            className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-saffron-700">
                {locale === 'hi'
                  ? `चरण ${activePhase.index}`
                  : `Phase ${activePhase.index}`}
              </span>
            </div>
            <h2
              lang={locale}
              className="mt-1 text-2xl font-bold text-ink-900"
            >
              {activePhase.title[locale]}
            </h2>
            <p
              lang={locale}
              className="mt-4 text-base leading-relaxed text-ink-800"
            >
              {activePhase.details[locale]}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-ink-50 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-600">
                  <Clock size={14} aria-hidden />
                  <span lang={locale}>{t.timeline.durationLabel}</span>
                </dt>
                <dd lang={locale} className="mt-1 text-sm text-ink-900">
                  {activePhase.duration[locale]}
                </dd>
              </div>
              <div className="rounded-lg bg-ink-50 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-600">
                  <Users size={14} aria-hidden />
                  <span lang={locale}>{t.timeline.keyActorsLabel}</span>
                </dt>
                <dd lang={locale} className="mt-1 text-sm text-ink-900">
                  {activePhase.keyActors[locale]}
                </dd>
              </div>
            </dl>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
