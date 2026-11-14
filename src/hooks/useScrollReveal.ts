import { useEffect } from 'react'

/** Blocks below the fold that rise in quietly the first time they scroll into view. */
const REVEAL_SELECTOR = [
  '.jam-projects > :first-child',
  '.jam-project-card',
  '.section-heading',
  '.about-story',
  '.team-card',
  '.team-roster--originals',
  '.footer-card',
].join(', ')

/** Siblings that reveal together get staggered, capped so long rows don't drag. */
const MAX_STAGGER = 4

export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    targets.forEach((element) => {
      const siblings = Array.from(element.parentElement?.children ?? []).filter((child) => child.matches(REVEAL_SELECTOR))
      element.style.setProperty('--reveal-index', String(Math.min(siblings.indexOf(element), MAX_STAGGER)))
      element.classList.add('reveal')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    // Opt in only after everything is wired, so content is never hidden without an observer to show it.
    document.documentElement.classList.add('reveal-ready')
    targets.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])
}
