import { useMemo } from 'react'

import { navigation } from '../data/siteContent'
import { useActiveSection } from '../hooks/useActiveSection'
import { BrandMark } from './BrandMark'

export function SiteHeader() {
  const sectionHrefs = useMemo(() => navigation.map((item) => item.href), [])
  const activeHref = useActiveSection(sectionHrefs)

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="content-shell flex items-center justify-between gap-4 overflow-visible rounded-full border-2 border-(--ink) bg-[rgba(247,234,223,0.92)] px-4 py-3 shadow-[0_7px_0_var(--shadow-ink)] backdrop-blur md:px-6">
        <a
          href="#top"
          className="inline-flex min-h-0 shrink-0 items-center overflow-visible text-(--ink) no-underline"
        >
          <BrandMark compact />
        </a>

        <nav aria-label="Primary" className="max-w-[60vw] overflow-x-auto overflow-y-visible sm:max-w-none">
          <ul className="flex min-w-max items-center gap-1 overflow-visible sm:gap-2">
            {navigation.map((item) => (
              <li key={item.href} className="overflow-visible">
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'location' : undefined}
                  className={[
                    'inline-flex rounded-full border-2 border-transparent px-3 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-(--ink) transition hover:border-(--ink) hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-teal) sm:px-4 sm:text-sm',
                    activeHref === item.href
                      ? 'bg-white/70 underline decoration-2 underline-offset-[0.45rem]'
                      : 'no-underline',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
