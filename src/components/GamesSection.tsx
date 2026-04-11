import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import itchioIcon from '../assets/logos/itchio-textless-black.svg'
import steamIcon from '../assets/logos/steam.svg'
import { getAutoGalleryImages, resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'
import { JamGamesShowcase } from './JamGamesShowcase'
import { SectionHeading } from './SectionHeading'

function GameLinks() {
  const primaryLinks = featuredGame.links.filter((link) => link.prominent)
  const steamLink = primaryLinks.find((link) => link.kind === 'steam')
  const platformLinks = primaryLinks.filter((link) => link.kind !== 'steam')
  const iconForKind: Record<string, string> = { itch: itchioIcon, steam: steamIcon }

  return (
    <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
      {steamLink ? (
        steamLink.href ? (
          <a
            href={steamLink.href}
            target="_blank"
            rel="noreferrer"
            className="primary-cta primary-cta--steam gap-2"
          >
            <img src={steamIcon} alt="" className="h-4 w-4" aria-hidden="true" />
            {steamLink.label}
          </a>
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
  const configuredGallery = useMemo(
    () =>
      featuredGame.gallery
        .filter((item) => item.type === 'image')
        .map((item) => ({ ...item, src: resolveGameMedia(featuredGame.assetFolder, item.file) }))
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
        }),
      ),
    [],
  )

  const galleryItems = configuredGallery.length > 0 ? configuredGallery : autoGallery
  const [selectedFile, setSelectedFile] = useState(galleryItems[0]?.file)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const selectedImage = galleryItems.find((item) => item.file === selectedFile) ?? galleryItems[0]
  const thumbRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const currentIndex = galleryItems.findIndex((item) => item.file === selectedFile)

  const navigate = (direction: 1 | -1) => {
    const next = galleryItems.at((currentIndex + direction + galleryItems.length) % galleryItems.length)
    if (next) setSelectedFile(next.file)
  }

  useEffect(() => {
    if (!selectedFile) return
    thumbRefs.current[selectedFile]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedFile])

  if (galleryItems.length === 0) return null

  return (
    <div className="space-y-4 border-t-2 border-(--ink)/8 pt-5 lg:border-0 lg:pt-0 lg:mx-auto lg:flex lg:w-full lg:max-w-xl lg:flex-col lg:justify-center">
      {/* Main stage — click to open lightbox */}
      <div
        className="game-gallery-stage rounded-4xl"
        onClick={() => setLightboxOpen(true)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open fullscreen gallery"
      >
        {selectedImage && (
          <div className="game-gallery-stage__frame">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="game-gallery-stage__image"
            />
          </div>
        )}
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
      </div>

      {galleryItems.length > 1 && (
        <div className="game-gallery-rail">
          <div className="game-gallery-thumb-area">
            <div className="game-gallery-thumb-row">
              {galleryItems.map((item) => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => setSelectedFile(item.file)}
                  ref={(el) => {
                    thumbRefs.current[item.file] = el
                  }}
                  className={`game-gallery-thumb ${item.file === selectedImage?.file ? 'is-active' : ''}`}
                  aria-pressed={item.file === selectedImage?.file}
                >
                  <img src={item.src} alt={item.alt} className="game-gallery-thumb__image" />
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
                onClick={() => setSelectedFile(item.file)}
                className={`game-gallery-dot ${item.file === selectedImage?.file ? 'is-active' : ''}`}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={galleryItems.map((item) => ({ src: item.src as string, alt: item.alt }))}
        index={currentIndex}
        on={{
          view: ({ index }) => {
            const item = galleryItems[index]
            if (item) setSelectedFile(item.file)
          },
        }}
      />
    </div>
  )
}

export function GamesSection() {
  const gameTitleImage = resolveGameMedia(featuredGame.assetFolder, featuredGame.titleImageFile)

  return (
    <section id="games" className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="content-shell space-y-6">
        <SectionHeading eyebrow="Projects" title="Games" description={featuredGame.summary} />

        <div
          className="section-card feature-panel relative grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
          style={{ '--feature-accent': featuredGame.accentColor ?? '#eb746d' } as CSSProperties}
        >
          <div className="space-y-6">
            <div className="space-y-4">
              {gameTitleImage ? (
                <img
                  src={gameTitleImage}
                  alt={featuredGame.title}
                  className="game-section-title-image mx-auto lg:mx-0"
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
