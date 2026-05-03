'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Vote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/timeline', label: t.nav.timeline },
    { href: '/journey', label: t.nav.journey },
    { href: '/ask', label: t.nav.ask },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-ink-900"
          aria-label={t.nav.brand}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-democracy-green text-white">
            <Vote size={20} aria-hidden />
          </span>
          <span lang={locale}>{t.nav.brand}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                lang={locale}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-saffron-50 text-saffron-700'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <LanguageToggle />
      </div>

      {/* Mobile nav (visible below md) */}
      <nav
        aria-label="Primary mobile"
        className="flex gap-1 overflow-x-auto border-t border-ink-200 px-4 py-2 md:hidden"
      >
        {links.map((link) => {
          const active =
            link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              lang={locale}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'bg-saffron-50 text-saffron-700'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
