import gamesData from './games.json'
import type { Game } from '../types/content'

export const games = gamesData as Game[]

/** Used when `titleImageBrightness` is omitted in games.json. */
export const DEFAULT_TITLE_IMAGE_BRIGHTNESS = 1.35

export const featuredGame = games.find((game) => game.featured) ?? games[0]

if (!featuredGame) {
  throw new Error('Add at least one game to src/data/games.json')
}
