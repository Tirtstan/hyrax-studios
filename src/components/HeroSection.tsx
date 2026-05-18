import type { CSSProperties } from 'react'

import { BrandMark } from './BrandMark'
import { resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'

export function HeroSection() {
  const heroCharacterImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.heroCharacterFile)
  const heroTitleImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.titleImageFile)

  return (
    <section id="top" className="px-4 pb-0 pt-6 sm:px-6 sm:pt-7">
      <div className="content-shell">
        <div className="section-card relative overflow-hidden p-4 sm:p-7 lg:p-9">
          <div className="hero-mesh absolute inset-0 opacity-80" aria-hidden="true" />
          <div className="hero-grain absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-8">
            <div className="hero-copy flex max-w-3xl flex-col gap-3 sm:gap-4">
              <BrandMark dense />
              <h1 className="font-display text-2xl uppercase leading-[0.95] text-(--ink) sm:text-4xl lg:text-6xl">
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
                <a href="#games" className="primary-cta">
                  See the games
                </a>
                <a href="#team" className="secondary-cta">
                  Meet the team
                </a>
              </div>
            </div>

            <div
              className={`featured-release-wrap self-start sm:mx-auto sm:w-full sm:max-w-md lg:mx-0 lg:max-w-none ${heroCharacterImage ? 'has-character' : ''}`}
              style={
                {
                  '--feature-accent': featuredGame.accentColor ?? '#eb746d',
                  '--feature-primary': '#292929',
                } as CSSProperties
              }
            >
              {heroCharacterImage ? (
                <div className="hero-character-sticker" aria-hidden="true">
                  <img src={heroCharacterImage} alt={featuredGame.heroCharacterAlt ?? ''} />
                </div>
              ) : null}

              <a
                href="#games"
                className="featured-release featured-release--hero block rounded-3xl border-2 border-(--ink) p-5 text-(--ink) no-underline sm:rounded-4xl sm:p-6"
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
