import { useEffect, useMemo, useState } from 'react'

export function useActiveSection(sectionHrefs: `#${string}`[]) {
  const sectionIds = useMemo(
    () => sectionHrefs.map((href) => href.replace('#', '')),
    [sectionHrefs],
  )
  const [activeHref, setActiveHref] = useState(sectionHrefs[0] ?? '#top')

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length === 0) {
          return
        }

        const id = visibleEntries[0].target.id
        setActiveHref((`#${id}` as `#${string}`) || sectionHrefs[0] || '#top')
      },
      {
        rootMargin: '-30% 0px -45% 0px',
        threshold: [0.15, 0.3, 0.5, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [sectionHrefs, sectionIds])

  return activeHref
}
