import { useEffect, useMemo, useRef, useState } from 'react'

import { navigation } from '../data/siteContent'
import { useActiveSection } from '../hooks/useActiveSection'
import { BrandMark } from './BrandMark'

export function SiteHeader() {
  const sectionHrefs = useMemo(() => navigation.map((item) => item.href), [])
  const activeHref = useActiveSection(sectionHrefs)
  const [menuOpen, setMenuOpen] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const linkClass = (href: string) =>
    [
      'site-header-link inline-flex shrink-0 rounded-full border-2 border-transparent px-2.5 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-(--ink) transition hover:border-(--ink) hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-teal) sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.2em]',
      activeHref === href ? 'bg-white/70 underline decoration-2 underline-offset-[0.35rem]' : 'no-underline',
    ].join(' ')

  const drawerLinkClass = (href: string) =>
    [
      'site-header-drawer-link block rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-(--ink) no-underline transition hover:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-teal)',
      activeHref === href ? 'bg-white/75 underline decoration-2 underline-offset-[0.35rem]' : '',
    ].join(' ')

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div ref={shellRef} className="content-shell relative">
        <div
          className={`site-header-scrim md:hidden ${menuOpen ? 'site-header-scrim--open' : ''}`}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />

        <div className="site-header-bar relative z-[2] flex items-center gap-2 overflow-visible rounded-full border-2 border-(--ink) bg-[rgba(247,234,223,0.92)] px-3 py-2.5 shadow-[0_7px_0_var(--shadow-ink)] backdrop-blur sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:px-6">
          <a
            href="#top"
            className="inline-flex min-h-0 min-w-0 shrink-0 items-center overflow-visible text-(--ink) no-underline"
            onClick={() => setMenuOpen(false)}
          >
            <BrandMark compact />
          </a>

          {/* Desktop / tablet: horizontal scroll + edge fade */}
          <div className="site-header-nav-shell relative ml-auto hidden min-h-0 min-w-0 flex-1 md:block">
            <nav
              aria-label="Primary"
              title="Scroll sideways if links are clipped"
              className="site-header-nav site-header-nav--scrollbar ml-auto flex max-w-full justify-end overflow-x-auto overscroll-x-contain pr-1 [-webkit-overflow-scrolling:touch]"
            >
              <ul className="flex min-w-max items-center gap-0.5 overflow-visible sm:gap-1">
                {navigation.map((item) => (
                  <li key={item.href} className="overflow-visible">
                    <a href={item.href} aria-current={activeHref === item.href ? 'location' : undefined} className={linkClass(item.href)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <button
            type="button"
            id="site-header-menu-button"
            className={`site-header-menu-toggle ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-(--ink) bg-white/55 text-(--ink) shadow-[0_3px_0_var(--shadow-ink)] transition-colors duration-200 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-teal) active:translate-y-px md:ml-0 md:hidden ${menuOpen ? 'site-header-menu-toggle--open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-header-drawer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="site-header-menu-bars" aria-hidden="true">
              <span className="site-header-menu-bar" />
              <span className="site-header-menu-bar" />
              <span className="site-header-menu-bar" />
            </span>
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          id="site-header-drawer"
          role="navigation"
          aria-label="Primary sections"
          aria-hidden={!menuOpen}
          {...(!menuOpen ? { inert: true as const } : {})}
          className={`site-header-drawer md:hidden ${menuOpen ? 'site-header-drawer--open' : ''}`}
        >
          <p className="site-header-drawer-hint px-4 pb-2 pt-3 text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-(--muted)">
            Jump to section
          </p>
          <ul className="flex flex-col gap-1 px-2 pb-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'location' : undefined}
                  className={drawerLinkClass(item.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
