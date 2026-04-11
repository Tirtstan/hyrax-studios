import { studioValues } from '../data/siteContent'
import { BrandMark } from './BrandMark'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-10 sm:px-6">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="About"
          title="A social-first indie studio"
          description="Hyrax Studios is a Cape Town based indie team focused on energetic games, fast iteration, and social experiences that stay fun well past the first session."
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="section-card space-y-6 p-6 sm:p-8">
            <div className="space-y-4">
              <BrandMark />
              <p className="text-base leading-8 text-(--muted)">
                Hyrax Studios is focused on making high-energy games that are easy to pick up,
                hard to put down, and built around strong social momentum. Projects are shaped by
                playful experimentation, quick iteration, and the kind of polished gameplay loops
                that reward replayability.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {studioValues.map((value) => (
                <article
                  key={value.title}
                  className="rounded-3xl border-2 border-(--ink) bg-[rgba(255,255,255,0.72)] p-5"
                >
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-(--ink)">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-(--muted)">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="section-card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(81,166,175,0.18),transparent)]" />
            <div className="relative space-y-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-(--brand-teal)">
                How we build
              </p>
              <h3 className="text-3xl font-black uppercase leading-none text-(--ink) sm:text-4xl">
                Fast iteration, playful experimentation, polished loops.
              </h3>
              <p className="text-sm leading-7 text-(--muted) sm:text-base">
                The aim is not one specific genre or one specific tone. The focus is on games with
                strong feel, clear social energy, and enough depth in the loop to keep players
                coming back.
              </p>
              <ul className="grid list-none gap-3 p-0 text-sm font-semibold text-(--ink) sm:grid-cols-3">
                <li className="rounded-[1.25rem] border-2 border-(--ink) bg-white/70 px-4 py-4">
                  Readable and immediate.
                </li>
                <li className="rounded-[1.25rem] border-2 border-(--ink) bg-white/70 px-4 py-4">
                  Built around shared play.
                </li>
                <li className="rounded-[1.25rem] border-2 border-(--ink) bg-white/70 px-4 py-4">
                  Refined for replayability.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
