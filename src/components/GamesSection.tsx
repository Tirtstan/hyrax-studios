import { games } from '../data/games'
import { GameChapter } from './GameChapter'
import { JamGamesShowcase } from './JamGamesShowcase'

const orderedGames = [...games].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))

export function GamesSection() {
  return (
    <section id="games" className="games-section" aria-label="Games">
      {orderedGames.map((game) => (
        <GameChapter key={game.id} game={game} />
      ))}

      <div className="games-section__more content-shell space-y-8 sm:space-y-10">
        <JamGamesShowcase />
      </div>
    </section>
  )
}
