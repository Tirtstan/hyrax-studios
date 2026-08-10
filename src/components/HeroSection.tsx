import type { CSSProperties } from 'react'

import steamIcon from '../assets/logos/steam.svg'
import { BrandMark } from './BrandMark'
import { resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'

export function HeroSection() {
  const heroCharacterImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.heroCharacterFile)
  const heroTitleImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.titleImageFile)
  const steamLink = featuredGame.links.find((link) => link.kind === 'steam' && link.href)

  return (
    <section id="top" className="hero-section px-4 pb-0 pt-2 sm:px-6 sm:pt-4 lg:pt-6">
      <div className="content-shell">
        <div
          className="section-card hero-section-card relative p-4 pb-3 sm:p-7 sm:pb-6 lg:p-9 lg:pb-8"
          style={
            {
              '--feature-accent': featuredGame.accentColor ?? '#ff4949',
              '--feature-primary': '#292929',
            } as CSSProperties
          }
        >
          <div className="hero-mesh absolute inset-0 opacity-80" aria-hidden="true" />
          <div className="hero-grain absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="hero-grid relative grid gap-5 sm:gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-8">
            <div className="hero-copy relative z-30 flex max-w-3xl flex-col gap-3 sm:gap-4">
              <BrandMark dense />
              <h1 className="font-display max-w-[min(100%,19rem)] text-balance text-[clamp(1.7rem,6.5vw,2.35rem)] uppercase leading-[0.98] tracking-tight text-(--ink) sm:max-w-3xl sm:text-4xl sm:tracking-normal lg:text-6xl">
                Made for playing together.
              </h1>
              <p className="hero-lede max-w-2xl text-sm leading-7 text-(--muted) sm:text-[1.05rem] sm:leading-8">
                We are a <strong className="hero-lede-location">Cape Town based video game studio</strong>{' '}
                focused on making high-energy games that are easy to pick up, hard to put down, and
                built with a strong social experience in mind. Every project is shaped by fast
                iteration, playful experimentation, and polished gameplay loops that reward
                replayability.
              </p>
              <div className="hero-actions flex flex-wrap gap-2 pt-1">
                {steamLink?.href ? (
                  <a href={steamLink.href} target="_blank" rel="noreferrer" className="hero-game-cta hero-game-cta--steam">
                    <img src={steamIcon} alt="" aria-hidden="true" />
                    <span>Wishlist on Steam</span>
                  </a>
                ) : null}
                <a href="#about" className="hero-site-link">
                  <span>Meet the studio</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10h11M11 6l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </div>

            <div
              className={`hero-showcase flex w-full flex-col items-center sm:mx-auto sm:max-w-md lg:mx-0 lg:max-w-none ${heroCharacterImage ? 'hero-showcase--with-character' : ''}`}
              style={
                {
                  '--feature-accent': featuredGame.accentColor ?? '#eb746d',
                  '--feature-primary': '#292929',
                } as CSSProperties
              }
            >
              <a
                href="#games"
                className="featured-release featured-release--hero block w-full max-w-none rounded-3xl border-2 border-(--ink) p-5 text-(--ink) no-underline sm:rounded-4xl sm:p-6"
              >
                <div className="featured-release-body space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    {heroTitleImage ? (
                      <img
                        src={heroTitleImage}
                        alt={featuredGame.title}
                        className="hero-release-title-image mx-auto"
                      />
                    ) : (
                      <p className="text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">
                        {featuredGame.title}
                      </p>
                    )}
                    <p className="featured-release-summary max-w-md text-xs leading-5 font-medium text-(--muted) sm:text-sm sm:font-semibold sm:leading-6 sm:text-(--ink)">
                      {featuredGame.summary}
                    </p>
                  </div>
                  <span className="featured-release-hint">
                    <span>View game spotlight</span>
                    <span className="featured-release-hint__icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none">
                        <path
                          d="m6 8 4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </div>
              </a>
              {heroCharacterImage ? (
                <div className="hero-character-sticker" aria-hidden="true">
                  <img src={heroCharacterImage} alt={featuredGame.heroCharacterAlt ?? ''} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
