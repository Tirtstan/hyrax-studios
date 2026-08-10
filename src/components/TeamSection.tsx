import type { CSSProperties } from 'react'

import itchioIcon from '../assets/logos/itchio-textless-black.svg'
import twitterIcon from '../assets/logos/twitter-brands-solid.png'
import peopleData from '../data/people.json'
import { resolveTeamPortrait } from '../data/teamMedia'
import type { Person, PersonLinkKind } from '../types/content'
import { SectionHeading } from './SectionHeading'

const people = peopleData as Person[]

const activePeople = people.filter((person) => (person.status ?? 'active') === 'active')
const alumniPeople = people.filter((person) => person.status === 'alumni')

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

function PersonLinkIcon({ kind }: { kind: PersonLinkKind }) {
  if (kind === 'itch' || kind === 'twitter') {
    return (
      <img
        src={kind === 'itch' ? itchioIcon : twitterIcon}
        alt=""
        aria-hidden="true"
        className="profile-link__brand-icon"
      />
    )
  }

  if (kind === 'email') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25" />
        <path d="m4.25 7 7.75 6 7.75-6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75" />
      <path d="M3.75 12h16.5M12 3.25c2.2 2.4 3.35 5.32 3.35 8.75S14.2 18.35 12 20.75C9.8 18.35 8.65 15.43 8.65 12S9.8 5.65 12 3.25Z" />
    </svg>
  )
}

type TeamPersonCardProps = {
  person: Person
}

function TeamPersonCard({ person }: TeamPersonCardProps) {
  const portraitSrc = resolveTeamPortrait(person.image)

  return (
    <article
      data-reveal
      className="team-card section-card w-full overflow-hidden p-3 sm:p-4"
      style={{ '--card-accent': person.accent } as CSSProperties}
    >
      <div className="team-card__portrait">
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt={`${person.name} profile art`}
            className="team-card__image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="team-card__avatar" aria-hidden="true">
            <span>{getInitials(person.name)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="team-card__focus">
          {person.focus}
        </p>
        <div>
          <h3 className="text-xl font-black uppercase leading-tight text-(--ink) sm:text-2xl">
            {person.name}
          </h3>
          <p className="mt-1 text-sm font-bold leading-5 text-(--muted)">{person.role}</p>
        </div>
      </div>

      {person.blurb ? (
        <p
          className="team-card__blurb mt-4 text-sm text-(--muted)"
          dangerouslySetInnerHTML={{ __html: person.blurb }}
        />
      ) : null}

      {person.links.length > 0 ? (
        <div className="team-card__links mt-4 flex flex-wrap gap-2">
          {person.links.map((link) => {
            const isMail = link.kind === 'email' || link.href.startsWith('mailto:')

            return (
              <a
                key={link.href}
                href={isMail && !link.href.startsWith('mailto:') ? `mailto:${link.href}` : link.href}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noreferrer'}
                className="profile-link"
                aria-label={`${person.name}: ${personLinkLabels[link.kind]}`}
                title={personLinkLabels[link.kind]}
              >
                <PersonLinkIcon kind={link.kind} />
                <span className="sr-only">{personLinkLabels[link.kind]}</span>
              </a>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}

export function TeamSection() {
  return (
    <section id="team" className="px-4 pb-0 pt-0 sm:px-6">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="Team"
          title="The People"
          description="Meet the ones behind Hyrax Studios."
        />

        <div className="team-roster mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activePeople.map((person) => (
            <TeamPersonCard key={person.id} person={person} />
          ))}
        </div>

        {alumniPeople.length > 0 ? (
          <div className="space-y-5">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-2xl font-black uppercase leading-tight text-(--ink)">
                Originals
              </h3>
              <p className="text-sm leading-7 text-(--muted) sm:text-base">
                People who helped shape the studio and still lend a hand from time to time.
              </p>
            </div>

            <div className="team-roster team-roster--originals grid gap-4">
              {alumniPeople.map((person) => (
                <TeamPersonCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
