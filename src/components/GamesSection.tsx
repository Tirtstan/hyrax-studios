import type { CSSProperties } from 'react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import 'yet-another-react-lightbox/styles.css'

import itchioIcon from '../assets/logos/itchio-textless-black.svg'
import steamIcon from '../assets/logos/steam.svg'
import { getAutoGalleryImages, resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'
import { JamGamesShowcase } from './JamGamesShowcase'
import { LoadAwareImage } from './LoadAwareImage'
import { SectionHeading } from './SectionHeading'

const Lightbox = lazy(() => import('yet-another-react-lightbox'))

function GameLinks() {
  const primaryLinks = featuredGame.links.filter((link) => link.prominent)
  const steamLink = primaryLinks.find((link) => link.kind === 'steam')
  const platformLinks = primaryLinks.filter((link) => link.kind !== 'steam')
  const iconForKind: Record<string, string> = { itch: itchioIcon, steam: steamIcon }

  return (
    <div className="flex max-w-full flex-wrap justify-center gap-3 lg:justify-start">
      {steamLink ? (
        steamLink.href ? (
          <div className="steam-cta-wrap">
            <span className="steam-playtest-badge">Playtest live!</span>
            <a
              href={steamLink.href}
              target="_blank"
              rel="noreferrer"
              className="primary-cta primary-cta--steam gap-2"
            >
              <img src={steamIcon} alt="" className="h-4 w-4" aria-hidden="true" />
              {steamLink.label}
            </a>
          </div>
        ) : (
          <span
            className="primary-cta primary-cta--steam gap-2 cursor-default"
            aria-label={steamLink.pendingLabel ?? `${steamLink.label} coming soon`}
          >
            <img src={steamIcon} alt="" className="h-4 w-4" aria-hidden="true" />
            {steamLink.pendingLabel ?? steamLink.label}
          </span>
        )
      ) : null}

      {platformLinks.map((link) =>
        link.href ? (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('#') ? undefined : '_blank'}
            rel={link.href.startsWith('#') ? undefined : 'noreferrer'}
            className={`primary-cta gap-2 ${link.kind === 'itch' ? 'primary-cta--itch' : ''}`}
          >
            {iconForKind[link.kind] && (
              <img src={iconForKind[link.kind]} alt="" className="h-4 w-4" aria-hidden="true" />
            )}
            {link.label}
          </a>
        ) : (
          <span
            key={link.label}
            className="primary-cta gap-2 cursor-default opacity-75"
            aria-label={link.pendingLabel ?? `${link.label} coming soon`}
          >
            {link.pendingLabel ?? link.label}
          </span>
        ),
      )}
    </div>
  )
}

function GameGallery() {
  const thumbnailFor = (file: string, fallback?: string) => {
    const name = file.replace(/\\/g, '/').split('/').pop()
    return (name && resolveGameMedia(featuredGame.assetFolder, `Gallery Thumbnails/${name}`)) || fallback
  }

  const configuredGallery = useMemo(
    () =>
      featuredGame.gallery
        .filter((item) => item.type === 'image')
        .map((item) => {
          const src = resolveGameMedia(featuredGame.assetFolder, item.file)
          return {
            type: 'image' as const,
            file: item.file,
            alt: item.alt,
            caption: item.caption,
            src,
            thumbnailSrc: thumbnailFor(item.file, src),
          }
        })
        .filter((item) => item.src),
    [],
  )

  const autoGallery = useMemo(
    () =>
      getAutoGalleryImages(featuredGame.assetFolder, featuredGame.galleryFolder).map(
        (item, index) => ({
          type: 'image' as const,
          file: item.file,
          alt: `${featuredGame.title} gallery image ${index + 1}`,
          src: item.src,
          thumbnailSrc: thumbnailFor(item.file, item.src),
        }),
      ),
    [],
  )

  const imageItems = configuredGallery.length > 0 ? configuredGallery : autoGallery
  const trailerItem = featuredGame.trailer
    ? {
        type: 'video' as const,
        file: `youtube:${featuredGame.trailer.youtubeId}`,
        alt: featuredGame.trailer.title,
        youtubeId: featuredGame.trailer.youtubeId,
        thumbnailSrc: resolveGameMedia(featuredGame.assetFolder, featuredGame.trailer.posterFile),
      }
    : undefined
  const galleryItems = trailerItem ? [trailerItem, ...imageItems] : imageItems
  const lightboxItems = galleryItems.filter((item) => item.type === 'image')
  const [selectedFile, setSelectedFile] = useState(galleryItems[0]?.file)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const selectedItem = galleryItems.find((item) => item.file === selectedFile) ?? galleryItems[0]
  const thumbRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const thumbRowRef = useRef<HTMLDivElement>(null)
  const skipThumbScrollRef = useRef(true)

  const currentIndex = galleryItems.findIndex((item) => item.file === selectedFile)
  const lightboxIndex = lightboxItems.findIndex((item) => item.file === selectedFile)

  const selectFile = (file: string) => {
    setSelectedFile(file)
    setVideoPlaying(false)
  }

  const navigate = (direction: 1 | -1) => {
    const next = galleryItems.at((currentIndex + direction + galleryItems.length) % galleryItems.length)
    if (next) selectFile(next.file)
  }

  useEffect(() => {
    if (!selectedFile || skipThumbScrollRef.current) {
      skipThumbScrollRef.current = false
      return
    }

    const thumb = thumbRefs.current[selectedFile]
    const row = thumbRowRef.current
    if (!thumb || !row) return

    const targetLeft = thumb.offsetLeft - (row.clientWidth - thumb.offsetWidth) / 2
    row.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [selectedFile])

  if (galleryItems.length === 0) return null

  return (
    <div className="game-gallery-stack min-w-0 space-y-4 border-t-2 border-(--ink)/8 pt-5 lg:border-0 lg:pt-0 lg:flex lg:h-full lg:w-full lg:min-h-0 lg:flex-col lg:justify-center">
      {/* Main stage: click to open lightbox */}
      <div
        className={`game-gallery-stage rounded-4xl ${selectedItem?.type === 'image' ? 'is-image' : 'is-video'}`}
        onClick={selectedItem?.type === 'image' ? () => setLightboxOpen(true) : undefined}
        onKeyDown={
          selectedItem?.type === 'image'
            ? (event) =>
                (event.key === 'Enter' || event.key === ' ') && setLightboxOpen(true)
            : undefined
        }
        role={selectedItem?.type === 'image' ? 'button' : undefined}
        tabIndex={selectedItem?.type === 'image' ? 0 : undefined}
        aria-label={selectedItem?.type === 'image' ? 'Open fullscreen gallery' : undefined}
      >
        {selectedItem && (
          <div className="game-gallery-stage__frame">
            {selectedItem.type === 'video' ? (
              videoPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedItem.youtubeId}?autoplay=1&rel=0`}
                  title={selectedItem.alt}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="game-gallery-video"
                  onClick={() => setVideoPlaying(true)}
                  aria-label={`Play ${selectedItem.alt}`}
                >
                  {selectedItem.thumbnailSrc ? (
                    <LoadAwareImage
                      src={selectedItem.thumbnailSrc}
                      alt=""
                      className="game-gallery-stage__image"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <span className="game-gallery-video__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8.25 5.3v13.4L19 12 8.25 5.3Z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="game-gallery-video__label">Play trailer</span>
                </button>
              )
            ) : (
              <LoadAwareImage
                key={selectedItem.file}
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="game-gallery-stage__image"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        )}
        {selectedItem?.type === 'image' ? (
          <div className="game-gallery-expand" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1h4M1 1v4M1 1l4.5 4.5M11 11H7M11 11V7M11 11 6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : null}
      </div>

      {galleryItems.length > 1 && (
        <div className="game-gallery-rail">
          <div className="game-gallery-thumb-area">
            <div ref={thumbRowRef} className="game-gallery-thumb-row">
              {galleryItems.map((item) => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => selectFile(item.file)}
                  ref={(el) => {
                    thumbRefs.current[item.file] = el
                  }}
                  className={`game-gallery-thumb ${item.file === selectedItem?.file ? 'is-active' : ''}`}
                  aria-pressed={item.file === selectedItem?.file}
                  aria-label={`Show ${item.alt}`}
                >
                  <LoadAwareImage
                    src={item.thumbnailSrc}
                    alt=""
                    className="game-gallery-thumb__image"
                    loading="lazy"
                    decoding="async"
                  />
                  {item.type === 'video' ? (
                    <span className="game-gallery-thumb__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M8.25 5.3v13.4L19 12 8.25 5.3Z" fill="currentColor" />
                      </svg>
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="game-gallery-arrow game-gallery-arrow--prev"
              aria-label="Previous image"
            >
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                <path d="M7.5 1.5 2 7.5l5.5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => navigate(1)}
              className="game-gallery-arrow game-gallery-arrow--next"
              aria-label="Next image"
            >
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                <path d="M1.5 1.5 7 7.5l-5.5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="game-gallery-dots" aria-label="Gallery pagination">
            {galleryItems.map((item, i) => (
              <button
                key={`${item.file}-dot`}
                type="button"
                onClick={() => selectFile(item.file)}
                className={`game-gallery-dot ${item.file === selectedItem?.file ? 'is-active' : ''}`}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {lightboxOpen ? (
        <Suspense fallback={null}>
          <Lightbox
            open
            close={() => setLightboxOpen(false)}
            slides={lightboxItems.map((item) => ({ src: item.src as string, alt: item.alt }))}
            index={lightboxIndex}
            on={{
              view: ({ index }) => {
                const item = lightboxItems[index]
                if (item) selectFile(item.file)
              },
            }}
          />
        </Suspense>
      ) : null}
    </div>
  )
}

export function GamesSection() {
  const gameTitleImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.titleImageFile)
  const featurePanelRef = useRef<HTMLDivElement>(null)
  const [spotlightActive, setSpotlightActive] = useState(false)

  useEffect(() => {
    const panel = featurePanelRef.current
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    if (!panel || mobileQuery.matches) return

    const observer = new IntersectionObserver(
      ([entry]) => setSpotlightActive(entry.isIntersecting && entry.intersectionRatio >= 0.28),
      { threshold: [0, 0.28, 0.55], rootMargin: '-8% 0px -12%' },
    )

    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="games"
      className={`px-4 pb-0 pt-0 sm:px-6${spotlightActive ? ' games-section--spotlight-active' : ''}`}
    >
      <div className="content-shell space-y-6">
        <SectionHeading eyebrow="Projects" title="Games" description={featuredGame.summary} />

        <div
          ref={featurePanelRef}
          data-reveal
          className="section-card feature-panel relative grid min-w-0 max-w-full grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-stretch"
          style={
            {
              '--feature-accent': featuredGame.accentColor ?? '#eb746d',
            } as CSSProperties
          }
        >
          <div className="min-w-0 space-y-6">
            <div className="space-y-4">
              {gameTitleImage ? (
                <img
                  src={gameTitleImage}
                  alt={featuredGame.title}
                  className="game-section-title-image mx-auto max-w-full lg:mx-0"
                />
              ) : (
                <h3 className="font-display text-center text-3xl uppercase leading-none text-(--ink) sm:text-4xl lg:text-left">
                  {featuredGame.title}
                </h3>
              )}
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {featuredGame.tags.map((tag) => (
                  <span key={tag} className="game-tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mx-auto max-w-2xl space-y-4 text-center text-sm leading-7 text-(--muted) sm:text-base lg:mx-0 lg:text-left">
                {featuredGame.description.map((paragraph) => (
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>

            <GameLinks />
          </div>

          <GameGallery />
        </div>

        <JamGamesShowcase />
      </div>
    </section>
  )
}
