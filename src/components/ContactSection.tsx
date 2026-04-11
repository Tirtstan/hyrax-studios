import instagramIcon from '../assets/logos/instagram-white.svg'
import itchioIcon from '../assets/logos/itchio-textless-white.svg'
import { socialLinks } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'

const iconByLabel: Record<string, string> = {
  Instagram: instagramIcon,
  'Itch.io': itchioIcon,
}

export function ContactSection() {
  return (
    <section id="contact" className="px-4 py-10 pb-16 sm:px-6 sm:pb-20">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="Contact"
          title="Keep the studio easy to find"
          description="The contact area closes the page with location, key channels, and a stronger public-facing finish while staying simple enough to expand later."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="section-card flex flex-col justify-between gap-8 p-6 sm:p-8">
            <div className="space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-(--brand-coral)">
                Studio Base
              </p>
              <h3 className="font-display text-3xl uppercase leading-none text-(--ink) sm:text-4xl">
                Cape Town, South Africa
              </h3>
              <p className="text-sm leading-7 text-(--muted) sm:text-base">
                Reach players where they already are, point them toward the current release, and
                keep a clear studio presence across channels as more projects come online.
              </p>
            </div>

            <div className="rounded-[1.75rem] border-2 border-(--ink) bg-white/70 p-5">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-(--muted)">
                Future addition
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-(--ink)">
                A direct studio contact email or enquiry form can plug into this section when that
                workflow is ready.
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="section-card group block p-6 no-underline transition hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-(--ink) bg-(--ink) p-2 shadow-[0_4px_0_var(--shadow-ink)]">
                      <img
                        src={iconByLabel[link.label]}
                        alt=""
                        aria-hidden="true"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-(--muted)">
                        Channel
                      </p>
                      <h3 className="text-2xl font-black uppercase leading-tight text-(--ink)">
                        {link.label}
                      </h3>
                      <p className="max-w-xl text-sm leading-7 text-(--muted)">
                        {link.caption}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit rounded-full border-2 border-(--ink) bg-(--brand-teal) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-(--ink) transition group-hover:bg-(--brand-gold)">
                    Open link
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
