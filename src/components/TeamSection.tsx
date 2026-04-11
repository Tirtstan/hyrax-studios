import type { CSSProperties } from 'react'

import peopleData from '../data/people.json'
import type { Person, PersonLinkKind } from '../types/content'
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

const personLinkLabels: Record<PersonLinkKind, string> = {
  email: 'Email',
  itch: 'Itch.io',
  website: 'Portfolio',
  twitter: 'Twitter',
}

export function TeamSection() {
  return (
    <section id="team" className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="Team"
          title="The People"
          description="Meet the ones behind Hyrax Studios."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <article
              key={person.id}
              className="team-card section-card overflow-hidden p-4 sm:p-5"
              style={{ '--card-accent': person.accent } as CSSProperties}
            >
              <div className="team-card__portrait">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={`${person.name} profile art`}
                    className="team-card__image"
                  />
                ) : (
                  <div className="team-card__avatar" aria-hidden="true">
                    <span>{getInitials(person.name)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <p className="accent-chip text-[0.64rem] font-extrabold uppercase tracking-[0.26em] text-(--ink)">
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

              {person.blurb && (
                <p className="mt-4 text-sm leading-7 text-(--muted)">{person.blurb}</p>
              )}

              {person.links.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {person.links.map((link) => {
                    const isMail = link.kind === 'email' || link.href.startsWith('mailto:')

                    return (
                      <a
                        key={link.href}
                        href={isMail && !link.href.startsWith('mailto:') ? `mailto:${link.href}` : link.href}
                        target={isMail ? undefined : '_blank'}
                        rel={isMail ? undefined : 'noreferrer'}
                        className="profile-link"
                      >
                        {personLinkLabels[link.kind]}
                      </a>
                    )
                  })}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
