import smallerProjectsData from '../data/smaller-projects.json'
import type { SmallProject } from '../types/content'

const smallerProjects = smallerProjectsData as SmallProject[]

export function JamGamesShowcase() {
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
        <p className="max-w-xl text-sm leading-6 text-(--muted)">
          This is a quieter showcase area for jam projects, smaller releases, and one-off
          experiments that deserve a place on the site without competing with the main title.
        </p>
      </div>

      {smallerProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {smallerProjects.map((game) => (
            <article
              key={game.id}
              className="rounded-[1.6rem] border-2 border-(--ink) bg-white/72 p-5"
            >
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-(--muted)">
                {game.event} · {game.year}
              </p>
              <h5 className="mt-3 text-xl font-black uppercase leading-tight text-(--ink)">
                {game.title}
              </h5>
              <p className="mt-3 text-sm leading-6 text-(--muted)">{game.summary}</p>
              {game.href ? (
                <a
                  href={game.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-[0.18em] text-(--ink) underline underline-offset-4"
                >
                  View project
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border-2 border-dashed border-(--ink) bg-white/58 p-5">
          <p className="text-sm leading-7 text-(--muted)">
            Add smaller projects in `src/data/smaller-projects.json` whenever you want to surface
            a jam build, experiment, or prototype here.
          </p>
        </div>
      )}
    </div>
  )
}
