'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { journey } from '@/data/journey';

const STORAGE_KEY = 'vote-bharath:journey-step';

export default function JourneyPage() {
  const { t, locale } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);

  // Restore progress on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < journey.length) {
        setStepIndex(parsed);
      }
    }
  }, []);

  // Persist progress whenever it changes
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(stepIndex));
  }, [stepIndex]);

  const currentStep = journey[stepIndex];
  const isComplete = stepIndex >= journey.length - 1;

  const progressPct = useMemo(
    () => Math.round(((stepIndex + 1) / journey.length) * 100),
    [stepIndex],
  );

  if (!currentStep) return null;

  const Icon =
    (Icons[currentStep.icon as keyof typeof Icons] as LucideIcon | undefined) ??
    Icons.Circle;

  return (
    <div className="space-y-6 py-6">
      <header>
        <h1 lang={locale} className="text-2xl font-bold text-ink-900 sm:text-3xl">
          {t.journey.title}
        </h1>
        <p lang={locale} className="mt-2 text-ink-600">
          {t.journey.subtitle}
        </p>
      </header>

      {/* Progress bar */}
      <div>
        <div className="mb-1 flex justify-between text-xs text-ink-600">
          <span lang={locale}>{t.journey.progressLabel}</span>
          <span>
            {stepIndex + 1} / {journey.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          className="h-2 w-full overflow-hidden rounded-full bg-ink-200"
        >
          <motion.div
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-democracy-green"
          />
        </div>
      </div>

      {/* Step indicator dots */}
      <ol
        className="flex items-center justify-between gap-2"
        aria-label={t.journey.title}
      >
        {journey.map((step, i) => (
          <li key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setStepIndex(i)}
              aria-current={i === stepIndex ? 'step' : undefined}
              aria-label={`${i + 1}. ${step.title[locale]}`}
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-colors ${
                i < stepIndex
                  ? 'bg-democracy-green text-white'
                  : i === stepIndex
                    ? 'bg-saffron-500 text-white ring-4 ring-saffron-100'
                    : 'bg-ink-200 text-ink-600 hover:bg-ink-300'
              }`}
            >
              {i < stepIndex ? <Icons.Check size={14} aria-hidden /> : i + 1}
            </button>
            {i < journey.length - 1 && (
              <span
                aria-hidden
                className={`mx-1 h-0.5 flex-1 ${
                  i < stepIndex ? 'bg-democracy-green' : 'bg-ink-200'
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      {/* Step body */}
      <AnimatePresence mode="wait">
        <motion.section
          key={currentStep.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 text-white"
              aria-hidden
            >
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">
                {locale === 'hi'
                  ? `चरण ${currentStep.index} / ${journey.length}`
                  : `Step ${currentStep.index} of ${journey.length}`}
              </p>
              <h2
                lang={locale}
                className="mt-1 text-xl font-bold text-ink-900 sm:text-2xl"
              >
                {currentStep.title[locale]}
              </h2>
            </div>
          </div>

          <p
            lang={locale}
            className="mt-5 text-base leading-relaxed text-ink-800"
          >
            {currentStep.description[locale]}
          </p>

          {currentStep.tips.length > 0 && (
            <div className="mt-5 rounded-lg border border-saffron-100 bg-saffron-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-saffron-700">
                {locale === 'hi' ? 'सुझाव' : 'Tips'}
              </p>
              <ul className="space-y-2">
                {currentStep.tips.map((tip, i) => (
                  <li
                    key={i}
                    lang={locale}
                    className="flex gap-2 text-sm text-ink-800"
                  >
                    <Icons.Lightbulb
                      size={14}
                      className="mt-0.5 shrink-0 text-saffron-700"
                      aria-hidden
                    />
                    <span>{tip[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentStep.actions.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {currentStep.actions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang={locale}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-saffron-300 bg-white px-3 py-2 text-sm font-medium text-saffron-700 transition-colors hover:bg-saffron-50"
                >
                  {action.label[locale]}
                  <Icons.ExternalLink size={12} aria-hidden />
                </a>
              ))}
            </div>
          )}

          {/* Nav controls */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              lang={locale}
              className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icons.ChevronLeft size={16} aria-hidden />
              {t.journey.prevStep}
            </button>

            {isComplete ? (
              <button
                type="button"
                onClick={() => setStepIndex(0)}
                lang={locale}
                className="inline-flex items-center gap-1 rounded-lg bg-democracy-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                <Icons.RotateCcw size={16} aria-hidden />
                {t.journey.restart}
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setStepIndex((i) => Math.min(journey.length - 1, i + 1))
                }
                lang={locale}
                className="inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-saffron-600"
              >
                {t.journey.nextStep}
                <Icons.ChevronRight size={16} aria-hidden />
              </button>
            )}
          </div>

          {isComplete && (
            <p
              lang={locale}
              className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800"
            >
              <Icons.CheckCircle2
                size={16}
                className="mr-1 inline align-text-bottom"
                aria-hidden
              />
              {t.journey.completed}
            </p>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
