import gamesData from './games.json'
import type { Game } from '../types/content'

export const games = gamesData as Game[]

export const featuredGame = games.find((game) => game.featured) ?? games[0]

if (!featuredGame) {
  throw new Error('Add at least one game to src/data/games.json')
}
