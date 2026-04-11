import { useMemo, useState } from 'react'

import itchioIcon from '../assets/logos/itchio-textless-black.svg'
import { getAutoGalleryImages, resolveGameMedia } from '../data/gameMedia'
import { featuredGame } from '../data/games'
import { JamGamesShowcase } from './JamGamesShowcase'
import { SectionHeading } from './SectionHeading'

export function GamesSection() {
  const configuredGallery = useMemo(
    () =>
      featuredGame.gallery
        .filter((item) => item.type === 'image')
        .map((item) => ({
          ...item,
          src: resolveGameMedia(featuredGame.assetFolder, item.file),
        }))
        .filter((item) => item.src),
    [],
  )

  const autoGallery = useMemo(
    () =>
      getAutoGalleryImages(featuredGame.assetFolder, featuredGame.galleryFolder).map((item, index) => ({
        type: 'image' as const,
        file: item.file,
        alt: `${featuredGame.title} gallery image ${index + 1}`,
        caption: undefined,
        src: item.src,
      })),
    [],
  )

  const galleryItems = configuredGallery.length > 0 ? configuredGallery : autoGallery
  const [selectedImageFile, setSelectedImageFile] = useState(galleryItems[0]?.file)
  const selectedImage = galleryItems.find((item) => item.file === selectedImageFile) ?? galleryItems[0]

  const primaryLinks = featuredGame.links.filter((link) => link.prominent)

  return (
    <section id="games" className="px-4 py-10 sm:px-6">
      <div className="content-shell space-y-6">
        <SectionHeading
          eyebrow="Projects"
          title="Games"
          description={featuredGame.summary}
        />

        <div className="section-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="accent-chip accent-chip--gold text-xs font-extrabold uppercase tracking-[0.28em]">
                {featuredGame.status}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-3xl uppercase leading-none text-(--ink) sm:text-4xl">
                {featuredGame.title}
              </h3>
              <p className="text-lg font-bold leading-7 text-(--ink)">
                {featuredGame.tagline}
              </p>
              <div className="max-w-2xl space-y-4 text-sm leading-7 text-(--muted) sm:text-base">
                {featuredGame.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredGame.tags.map((tag) => (
                <span
                  key={tag}
                  className="game-tag-chip"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryLinks.map((link) =>
                link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('#') ? undefined : '_blank'}
                    rel={link.href.startsWith('#') ? undefined : 'noreferrer'}
                    className="primary-cta gap-2"
                  >
                    {link.kind === 'itch' ? (
                      <img src={itchioIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                    ) : null}
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
          </div>

          <div className="space-y-4">
            <div className="game-gallery-stage min-h-76 rounded-4xl p-3 sm:p-4">
              {selectedImage ? (
                <div className="game-gallery-stage__frame">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="game-gallery-stage__image"
                  />
                  <div className="game-gallery-stage__overlay">
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-white/75">
                      {featuredGame.title} gallery
                    </p>
                    {selectedImage.caption ? (
                      <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-white/92">
                        {selectedImage.caption}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="game-gallery-empty h-full rounded-[1.6rem] border-2 border-dashed border-(--ink) p-6">
                  <div className="space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-(--muted)">
                      Gallery ready
                    </p>
                    <h4 className="font-display text-2xl uppercase leading-none text-(--ink) sm:text-3xl">
                      Add screenshots here
                    </h4>
                    <p className="max-w-md text-sm leading-7 text-(--muted)">
                      Drop images into `src/assets/Games/{featuredGame.assetFolder}` and point to
                      them in `src/data/games.json`. The gallery will handle screenshots now and can
                      be extended to videos later.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {galleryItems.length > 1 ? (
              <div className="game-gallery-thumb-row">
                {galleryItems.map((item) => (
                  <button
                    key={item.file}
                    type="button"
                    onClick={() => setSelectedImageFile(item.file)}
                    className={`game-gallery-thumb ${item.file === selectedImage?.file ? 'is-active' : ''}`}
                    aria-pressed={item.file === selectedImage?.file}
                  >
                    <img src={item.src} alt={item.alt} className="game-gallery-thumb__image" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <JamGamesShowcase />
      </div>
    </section>
  )
}
