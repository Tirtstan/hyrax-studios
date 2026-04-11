import type { CSSProperties } from 'react'

import peopleData from '../data/people.json'
import type { Person } from '../types/content'
import { SectionHeading } from './SectionHeading'

const people = peopleData as Person[]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function TeamSection() {
  return (
    <section id="team" className="px-4 py-10 sm:px-6">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="Team"
          title="The people behind the studio"
          description="Portrait art can be assigned per person in `people.json`, with the image now taking the lead in each card rather than sitting as a small secondary element."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <article
              key={person.id}
              className="team-card section-card overflow-hidden p-4 sm:p-5"
              style={{ '--card-accent': person.accent } as CSSProperties}
            >
              <div className="team-card__portrait relative">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={`${person.name} profile art`}
                    className="team-card__image"
                  />
                ) : (
                  <div className="team-card__avatar" aria-hidden="true">
                    <span>{getInitials(person.name)}</span>
                    <span className="team-card__avatar-label">Profile art ready</span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.28em] text-(--muted)">
                  {person.focus}
                </p>
                <div>
                  <h3 className="text-2xl font-black uppercase leading-tight text-(--ink)">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold leading-6 text-(--muted)">
                    {person.role}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-(--muted)">{person.blurb}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {person.links.length > 0 ? (
                  person.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-cta"
                    >
                      {link.label}
                    </a>
                  ))
                ) : (
                  <span className="inline-flex rounded-full border-2 border-(--ink) bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-(--muted)">
                    Links can be added when profiles are ready
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
