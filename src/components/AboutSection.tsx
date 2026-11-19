import aboutLogoSrc from '../assets/brand/hyrax-logo-full-black.webp'
import about from '../data/about.json'
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
              <SectionHeading title={about.title} description={about.description} />
              <div className="max-w-3xl space-y-4">
                {about.paragraphs.map((html, index) => (
                  <p
                    key={index}
                    className="text-base leading-8 text-(--muted)"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
              {about.meta.length > 0 ? (
                <p className="about-lockup__meta">
                  {about.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
