'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { TimelinePhase } from '@/data/timeline';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  phase: TimelinePhase;
  isActive: boolean;
  onClick: () => void;
}

export function PhaseCard({ phase, isActive, onClick }: Props) {
  const { locale, t } = useLanguage();

  // lucide-react exports icons as named exports; look up dynamically.
  const Icon = (Icons[phase.icon as keyof typeof Icons] as LucideIcon | undefined) ?? Icons.Circle;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`flex min-w-[260px] snap-start flex-col gap-3 rounded-xl border p-5 text-left transition-colors ${
        isActive
          ? 'border-saffron-500 bg-white shadow-lg ring-2 ring-saffron-200'
          : 'border-ink-200 bg-white hover:border-saffron-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-lg ${
            isActive
              ? 'bg-saffron-500 text-white'
              : 'bg-saffron-50 text-saffron-700'
          }`}
          aria-hidden
        >
          <Icon size={20} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-600">
          {locale === 'hi' ? `चरण ${phase.index}` : `Phase ${phase.index}`}
        </span>
      </div>
      <h3 lang={locale} className="text-base font-semibold text-ink-900">
        {phase.title[locale]}
      </h3>
      <p lang={locale} className="text-sm text-ink-600">
        {phase.summary[locale]}
      </p>
      <div className="mt-1 inline-flex items-center gap-1 text-xs text-ink-600">
        <Icons.Clock size={12} aria-hidden />
        <span lang={locale}>
          {t.timeline.durationLabel}: {phase.duration[locale]}
        </span>
      </div>
    </motion.button>
  );
}
