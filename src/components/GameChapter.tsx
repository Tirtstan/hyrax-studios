import type { CSSProperties } from 'react'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import 'yet-another-react-lightbox/styles.css'

import itchioIcon from '../assets/logos/itchio-textless-black.svg'
import steamIcon from '../assets/logos/steam.svg'
import { getAutoGalleryImages, resolveGameMedia } from '../data/gameMedia'
import { haptic } from '../hooks/haptics'
import type { Game } from '../types/content'
import { RamIntro } from './RamIntro'

const loadLightbox = () => import('yet-another-react-lightbox')
const Lightbox = lazy(loadLightbox)

/** `src` is the full-size original (lightbox), `screenSrc` the 1600px copy for the main screen, `thumbnailSrc` the 480px strip copy. */
type Shot = { file: string; alt: string; src: string; screenSrc: string; thumbnailSrc: string }

/** What the big screen is showing. */
type View = { kind: 'loop' } | { kind: 'trailer' } | { kind: 'shot'; index: number }

function useScreenshots(game: Game): Shot[] {
  return useMemo(() => {
    // Resized copies live in sibling folders under the same file name; fall back to the original when one is missing.
    const sizedCopy = (folder: string, file: string, fallback: string) => {
      const name = file.replace(/\\/g, '/').split('/').pop()
      return (name && resolveGameMedia(game.assetFolder, `${folder}/${name}`)) || fallback
    }
    const sized = (file: string, src: string) => ({
      screenSrc: sizedCopy('Screen Size', file, src),
      thumbnailSrc: sizedCopy('Gallery Thumbnails', file, src),
    })

    const configured = game.gallery
      .filter((item) => item.type === 'image')
      .flatMap((item) => {
        const src = resolveGameMedia(game.assetFolder, item.file)
        return src ? [{ file: item.file, alt: item.alt, src, ...sized(item.file, src) }] : []
      })
    if (configured.length > 0) return configured

    return getAutoGalleryImages(game.assetFolder, game.galleryFolder).map((item, index) => ({
      file: item.file,
      alt: `${game.title} screenshot ${index + 1}`,
      src: item.src,
      ...sized(item.file, item.src),
    }))
  }, [game])
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return reduce
}

export function GameChapter({ game, headingLevel = 2 }: { game: Game; headingLevel?: 2 | 3 }) {
  const shots = useScreenshots(game)
  const titleImage = resolveGameMedia(game.assetFolder, game.titleImageFile)
  const sticker = resolveGameMedia(game.assetFolder, game.heroCharacterFile)
  const loopSrc = resolveGameMedia(game.assetFolder, game.loopVideoFile)
  // The trailer only appears as a strip thumbnail, so prefer its 480px copy.
  const posterFile = game.trailer?.posterFile
  const trailerPoster =
    (posterFile && resolveGameMedia(game.assetFolder, `Gallery Thumbnails/${posterFile}`)) ||
    resolveGameMedia(game.assetFolder, posterFile)
  const reduceMotion = usePrefersReducedMotion()

  const [view, setView] = useState<View>(loopSrc ? { kind: 'loop' } : { kind: 'shot', index: 0 })
  // Bumped on every manual pick so the progress fill restarts even when the same shot is picked again.
  const [pickCount, setPickCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLUListElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const stickerRef = useRef<HTMLImageElement>(null)

  // The sticker stays hidden while the intro plays, then Fred lands exactly on it and hands over.
  const hasIntro = game.introAnimation === 'ram' && Boolean(sticker) && !reduceMotion
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])
  const introPlaying = hasIntro && !introDone

  const autoplay = view.kind === 'shot' && shots.length > 1 && !reduceMotion && lightboxIndex === null
  const currentShot = view.kind === 'shot' ? view.index : -1

  // Warm the lightbox chunk so the first click on the big screen opens it straight away.
  useEffect(() => {
    const id = window.setTimeout(() => void loadLightbox(), 1500)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduceMotion) video.pause()
    else void video.play().catch(() => {})
  }, [view.kind, reduceMotion])

  // Slide the selected thumbnail to the middle of the strip (scrolls the strip only, never the page).
  useEffect(() => {
    const strip = stripRef.current
    const active = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!strip || !active) return
    const left = active.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft
    strip.scrollTo({ left: left - (strip.clientWidth - active.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [view, reduceMotion])

  const pickShot = (index: number) => {
    setView({ kind: 'shot', index })
    setPickCount((count) => count + 1)
  }
  // Arrow buttons step through the screenshots; from the trailer they go back to the first or last shot.
  const stepShot = (delta: number) =>
    pickShot(currentShot < 0 ? (delta > 0 ? 0 : shots.length - 1) : (currentShot + delta + shots.length) % shots.length)
  const nextShot = () => setView((current) => (current.kind === 'shot' ? { kind: 'shot', index: (current.index + 1) % shots.length } : current))

  const linksWithHref = game.links.filter((link) => link.href)
  const buyLink = linksWithHref.find((link) => link.kind === 'steam' && link.badge) ?? linksWithHref.find((link) => link.kind === 'steam')
  const extraLinks = linksWithHref.filter((link) => link !== buyLink)
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const hasStrip = shots.length > 0 || Boolean(game.trailer)

  return (
    <article
      className="game-chapter"
      style={{ '--chapter': game.chapterColor, '--chapter-pop': game.chapterPopColor } as CSSProperties}
      aria-labelledby={`${game.id}-title`}
    >
      {/* Covers the whole chapter (not just the stage) so the goats fly in front of the title art too. */}
      {introPlaying && sticker ? (
        <RamIntro src={sticker} stageRef={stageRef} screenRef={screenRef} stickerRef={stickerRef} onDone={finishIntro} />
      ) : null}

      <header className="game-chapter__head">
        <Heading id={`${game.id}-title`} className="game-chapter__title">
          {titleImage ? <img src={titleImage} alt={game.title} width={618} height={243} /> : game.title}
        </Heading>
        {game.tagline ? <p className="game-chapter__tagline">{game.tagline}</p> : null}
      </header>

      <div ref={stageRef} className="game-chapter__stage">
        {sticker ? (
          <img
            ref={stickerRef}
            className={`game-chapter__sticker${hasIntro ? ' has-intro' : ''}${introPlaying ? ' is-awaiting-intro' : ''}`}
            src={sticker}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div ref={screenRef} className="game-chapter__screen">
          {view.kind === 'trailer' && game.trailer ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${game.trailer.youtubeId}?autoplay=1&rel=0`}
              title={game.trailer.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : view.kind === 'loop' && loopSrc ? (
            <video
              ref={videoRef}
              className="game-chapter__loop"
              src={loopSrc}
              poster={shots[0]?.screenSrc}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <button
              type="button"
              className="game-chapter__slideshow"
              onClick={() => setLightboxIndex(currentShot)}
              aria-label={shots[currentShot] ? `View full size: ${shots[currentShot].alt}` : 'View screenshot full size'}
            >
              {shots.map((shot, index) => (
                <img
                  key={shot.file}
                  src={shot.screenSrc}
                  alt=""
                  className={index === currentShot ? 'is-current' : undefined}
                  // The current and next shots load first; the rest follow lazily.
                  loading={index === currentShot || index === (currentShot + 1) % shots.length ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ))}
            </button>
          )}
        </div>

        {hasStrip ? (
          <div className="game-chapter__carousel">
          {shots.length > 1 ? (
            <button type="button" className="game-chapter__step" aria-label="Previous screenshot" onClick={() => {
              haptic()
              stepShot(-1)
            }}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
            </button>
          ) : null}
          <ul ref={stripRef} className="game-chapter__strip" aria-label={`${game.title} trailer and screenshots`}>
            {game.trailer ? (
              <li>
                <button
                  type="button"
                  className="game-chapter__thumb game-chapter__thumb--trailer"
                  aria-current={view.kind === 'trailer'}
                  aria-label={`Play ${game.trailer.title}`}
                  onClick={() => {
                    haptic()
                    setView({ kind: 'trailer' })
                  }}
                >
                  {trailerPoster ? <img src={trailerPoster} alt="" width={480} height={270} decoding="async" /> : null}
                  <span className="game-chapter__play" aria-hidden="true" />
                </button>
              </li>
            ) : null}
            {shots.map((shot, index) => (
              <li key={shot.file}>
                <button
                  type="button"
                  className="game-chapter__thumb"
                  aria-current={index === currentShot}
                  aria-label={`Show screenshot: ${shot.alt}`}
                  onClick={() => {
                    haptic()
                    pickShot(index)
                  }}
                >
                  <img src={shot.thumbnailSrc} alt="" width={480} height={270} decoding="async" />
                  {autoplay && index === currentShot ? (
                    <span
                      key={`${index}-${pickCount}`}
                      className="game-chapter__progress-fill"
                      aria-hidden="true"
                      onAnimationEnd={nextShot}
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {shots.length > 1 ? (
            <button type="button" className="game-chapter__step" aria-label="Next screenshot" onClick={() => {
              haptic()
              stepShot(1)
            }}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" /></svg>
            </button>
          ) : null}
          </div>
        ) : null}
      </div>

      <div className="game-chapter__actions">
        {buyLink ? (
          <div className="steam-cta-wrap">
            {buyLink.badge ? <span className="steam-release-badge">{buyLink.badge}</span> : null}
            <a href={buyLink.href} target="_blank" rel="noreferrer" className="primary-cta primary-cta--steam" onClick={() => haptic('cta')}>
              <img src={steamIcon} alt="" className="h-4 w-4" aria-hidden="true" />
              {buyLink.label}
            </a>
          </div>
        ) : null}
        {game.trailer ? (
          <button
            type="button"
            className="secondary-cta"
            aria-pressed={view.kind === 'trailer'}
            onClick={() => {
              haptic('toggle')
              if (view.kind === 'trailer') pickShot(0)
              else setView({ kind: 'trailer' })
            }}
          >
            {view.kind === 'trailer' ? 'Back to screenshots' : 'Watch trailer'}
          </button>
        ) : null}
      </div>

      {extraLinks.length > 0 ? (
        <p className="game-chapter__more">
          {extraLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.kind === 'itch' ? <img src={itchioIcon} alt="" aria-hidden="true" /> : null}
              {link.kind === 'steam' ? <img src={steamIcon} alt="" aria-hidden="true" /> : null}
              {link.label}
            </a>
          ))}
        </p>
      ) : null}

      <div className="game-chapter__copy">
        {game.description.map((paragraph) => (
          <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>

      {game.tags.length > 0 ? (
        <ul className="game-chapter__tags" aria-label={`${game.title} genres and features`}>
          {game.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}

      {lightboxIndex !== null ? (
        <Suspense fallback={null}>
          <Lightbox
            open
            close={() => setLightboxIndex(null)}
            index={lightboxIndex}
            slides={shots.map((shot) => ({ src: shot.src, alt: shot.alt }))}
            on={{ view: ({ index }) => setView({ kind: 'shot', index }) }}
          />
        </Suspense>
      ) : null}
    </article>
  )
}
