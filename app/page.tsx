'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function HomePage() {
  const { t, locale } = useLanguage();

  const features = [
    {
      href: '/timeline',
      icon: Calendar,
      title: t.home.feature1Title,
      desc: t.home.feature1Desc,
      gradient: 'from-saffron-400 to-saffron-600',
    },
    {
      href: '/journey',
      icon: MapPin,
      title: t.home.feature2Title,
      desc: t.home.feature2Desc,
      gradient: 'from-democracy-green to-emerald-700',
    },
    {
      href: '/ask',
      icon: MessageCircle,
      title: t.home.feature3Title,
      desc: t.home.feature3Desc,
      gradient: 'from-democracy-navy to-indigo-700',
    },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-saffron-50 via-white to-emerald-50 p-8 sm:p-12"
      >
        <h1
          lang={locale}
          className="text-3xl font-bold leading-tight text-ink-900 sm:text-4xl lg:text-5xl"
        >
          {t.home.heroTitle}
        </h1>
        <p
          lang={locale}
          className="mt-4 max-w-2xl text-base text-ink-600 sm:text-lg"
        >
          {t.home.heroSubtitle}
        </p>
        <Link
          href="/timeline"
          lang={locale}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-saffron-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-saffron-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2"
        >
          {t.home.cta}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </motion.section>

      {/* Feature grid */}
      <section
        aria-label={locale === 'hi' ? 'विशेषताएँ' : 'Features'}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            >
              <Link
                href={feature.href}
                className="group flex h-full flex-col rounded-xl border border-ink-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-saffron-400 hover:shadow-md"
              >
                <div
                  className={`mb-4 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white`}
                  aria-hidden
                >
                  <Icon size={24} />
                </div>
                <h2
                  lang={locale}
                  className="text-lg font-semibold text-ink-900"
                >
                  {feature.title}
                </h2>
                <p lang={locale} className="mt-2 text-sm text-ink-600">
                  {feature.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-saffron-700 transition-transform group-hover:translate-x-0.5">
                  {locale === 'hi' ? 'खोलें' : 'Open'}
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
