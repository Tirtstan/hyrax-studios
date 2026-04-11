import { BrandMark } from './BrandMark'
import { resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'

export function HeroSection() {
  const heroCharacterImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.heroCharacterFile)
  const heroTitleImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.titleImageFile)

  return (
    <section id="top" className="px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-7">
      <div className="content-shell">
        <div className="section-card relative overflow-hidden p-5 sm:p-7 lg:p-9">
          <div className="hero-mesh absolute inset-0 opacity-80" aria-hidden="true" />
          <div className="hero-grain absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-8">
            <div className="flex max-w-3xl flex-col gap-3 sm:gap-4">
              <BrandMark dense />
              <h1 className="text-3xl font-black uppercase leading-[0.95] text-(--ink) sm:text-4xl lg:text-6xl">
                Games that are easy to pick up and hard to put down.
              </h1>
              <p className="hero-lede max-w-2xl text-base leading-7 text-(--muted) sm:text-[1.05rem] sm:leading-8">
                We are a <strong>Cape Town based indie studio</strong> focused on making{' '}
                <strong>high-energy games</strong> that are{' '}
                <strong>easy to pick up, hard to put down</strong>, and built with a{' '}
                <strong className="hero-lede-underline">strong social experience</strong> in mind.
                Every project is shaped by <strong>fast iteration</strong>,{' '}
                <strong>playful experimentation</strong>, and a commitment to{' '}
                <strong>polished gameplay loops</strong> that reward <strong>replayability</strong>.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a href="#games" className="primary-cta">
                  See the games
                </a>
                <a href="#team" className="secondary-cta">
                  Meet the team
                </a>
              </div>
            </div>

            <div className={`featured-release-wrap self-start ${heroCharacterImage ? 'has-character' : ''}`}>
              {heroCharacterImage ? (
                <div className="hero-character-sticker" aria-hidden="true">
                  <img src={heroCharacterImage} alt={featuredGame.heroCharacterAlt ?? ''} />
                </div>
              ) : null}

              <a
                href="#games"
                className="featured-release block rounded-3xl border-2 border-(--ink) p-5 text-(--ink) no-underline sm:rounded-4xl sm:p-6 lg:max-w-none"
              >
                <div className="space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <p className="accent-chip accent-chip--hero text-[0.65rem] font-extrabold uppercase tracking-[0.28em] sm:text-xs sm:tracking-[0.32em]">
                      Featured game
                    </p>
                    {heroTitleImage ? (
                      <img
                        src={heroTitleImage}
                        alt={featuredGame.title}
                        className="hero-release-title-image"
                      />
                    ) : (
                      <p className="text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">
                        {featuredGame.title}
                      </p>
                    )}
                    <p className="max-w-md text-sm font-semibold leading-snug sm:leading-6">
                      {featuredGame.summary}
                    </p>
                  </div>
                  <span className="featured-release-hint">Open full spotlight</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
