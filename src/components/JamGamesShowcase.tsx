import smallerProjectsData from '../data/smaller-projects.json'
import { resolveProjectMedia } from '../data/projectMedia'
import type { SmallProject } from '../types/content'

const smallerProjects = smallerProjectsData as SmallProject[]

export function JamGamesShowcase() {
  if (smallerProjects.length === 0) return null

  return (
    <section className="jam-projects space-y-4" aria-labelledby="jam-projects-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--brand-teal)">
            Jam Projects
          </p>
          <h3 id="jam-projects-title" className="mt-2 text-2xl font-black uppercase leading-tight text-(--ink)">
            The prototype shelf
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted)">
            Fast ideas, strange constraints, and the games that taught us something useful.
          </p>
        </div>
        <p className="jam-projects__count" aria-label={`${smallerProjects.length} playable projects`}>
          {String(smallerProjects.length).padStart(2, '0')} playable builds
        </p>
      </div>

      <div className="jam-project-shelf">
        {smallerProjects.map((game) => {
          const imageSrc = resolveProjectMedia(game.image)
          const content = (
            <>
              <div className="jam-project-card__media">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={game.imageAlt ?? `${game.title} gameplay`}
                    className="jam-project-card__image"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="jam-project-card__fallback" aria-hidden="true">
                    {game.title.slice(0, 2)}
                  </span>
                )}
                <span className="jam-project-card__play">Play build</span>
              </div>
              <div className="jam-project-card__body">
                <p className="jam-project-card__meta">
                  {game.event} <span aria-hidden="true">·</span> {game.year}
                </p>
                <h4>{game.title}</h4>
                <p>{game.summary}</p>
              </div>
            </>
          )

          return game.href ? (
            <a
              key={game.id}
              href={game.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
              className="jam-project-card"
              aria-label={`Play ${game.title} on Itch.io`}
            >
              {content}
            </a>
          ) : (
            <article key={game.id} data-reveal className="jam-project-card">
              {content}
            </article>
          )
        })}
      </div>
    </section>
  )
}
