import aboutLogoSrc from '../assets/brand/hyrax-logo-full-black.webp'
import { LoadAwareImage } from './LoadAwareImage'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section id="about" className="px-4 pb-0 pt-0 sm:px-6">
      <div className="content-shell">
        <article className="about-story">
          <div className="about-lockup">
            <div className="about-lockup__brand">
              <LoadAwareImage
                src={aboutLogoSrc}
                alt="Hyrax Studios"
                className="about-lockup__logo"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="about-lockup__content">
              <SectionHeading
                title="Made for playing together"
                description="We're a Cape Town video game studio making high-energy games that are easy to pick up, hard to put down, and best played with friends."
              />
              <div className="max-w-3xl space-y-4">
                <p className="text-base leading-8 text-(--muted)">
                  <strong>
                    <em>Hyrax Studios</em>
                  </strong>{' '}
                  was founded by a small group of classmates in our already small classrooms. We
                  were initially credited under <em>Rookie Games</em> and debuted our first public
                  prototype <em>GET RAMMED</em> at{' '}
                  <a
                    href="https://playtopiafestival.co.za/2025-2/"
                    target="_blank"
                    rel="noreferrer"
                    className="about-link"
                  >
                    Playtopia 2025
                  </a>
                  , originally developed for an 8-hour game jam and now our first full release, out
                  on Steam.
                </p>
                <p className="text-base leading-8 text-(--muted)">
                  We make games for people to play together.
                </p>
              </div>
              <p className="about-lockup__meta">
                <span>Founded February 2026</span>
                <span>Cape Town, South Africa</span>
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
