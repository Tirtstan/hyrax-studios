import smallerProjectsData from '../data/smaller-projects.json'
import type { SmallProject } from '../types/content'

const smallerProjects = smallerProjectsData as SmallProject[]

export function JamGamesShowcase() {
  if (smallerProjects.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--brand-teal)">
            Jam Projects
          </p>
          <h4 className="mt-2 text-2xl font-black uppercase leading-tight text-(--ink)">
            Smaller experiments and prototypes
          </h4>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {smallerProjects.map((game) => (
          <article
            key={game.id}
            data-reveal
            className="min-w-0 rounded-[1.6rem] border-2 border-(--ink) bg-white/72 p-5"
          >
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-(--muted)">
              {game.event} · {game.year}
            </p>
            <h5 className="mt-3 text-xl font-black uppercase leading-tight text-(--ink)">
              {game.title}
            </h5>
            <p className="mt-3 text-sm leading-6 text-(--muted)">{game.summary}</p>
            {game.href && (
              <a
                href={game.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-[0.18em] text-(--ink) underline underline-offset-4"
              >
                View project
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
