import aboutLogoSrc from '../assets/brand/HyraxLogoFullBlack.svg'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="About"
          title="A Cape Town indie studio"
          description="Hyrax Studios is a video game studio based in Cape Town, South Africa, building games with a strong social experience."
        />

        <article className="section-card p-6 sm:p-8">
          <div className="about-lockup">
            <div className="about-lockup__brand">
              <img
                src={aboutLogoSrc}
                alt="Hyrax Studios"
                className="about-lockup__logo"
              />
            </div>

            <div className="about-lockup__content">
              <div className="max-w-4xl space-y-4">
            <p className="text-base leading-8 text-(--muted)">
                  <strong>
                    <em>Hyrax Studios</em>
                  </strong>{' '}
                  was founded by a small group of classmates in our already small classrooms. We
                  were initially credited under <em>Rookie Games</em> and debuted our first public
                  prototype <em>Get Rammed</em> at{' '}
                  <a
                    href="https://playtopiafestival.co.za/2025-2/"
                    target="_blank"
                    rel="noreferrer"
                    className="about-link"
                  >
                    Playtopia 2025
                  </a>
                  , originally developed for an 8-hour game jam and now heading for our first full
                  release.
                </p>
                <p className="text-base leading-8 text-(--muted)">
                  At the heart of our games is the social creation and bond that comes from playing
                  together.
                </p>
              </div>
              <p className="about-lockup__meta">
                Founded February 2026
                <span aria-hidden="true"> · </span>
                Cape Town, South Africa
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
