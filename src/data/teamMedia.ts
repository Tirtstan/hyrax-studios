const portraitModules = import.meta.glob('../assets/team/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function fileName(path: string) {
  return path.replace(/\\/g, '/').split('/').pop() ?? path
}

/**
 * Resolves a portrait path from people.json to a build-safe URL.
 * JSON may use "LukePortrait.png" or "src/assets/team/LukePortrait.png".
 */
export function resolveTeamPortrait(image?: string) {
  if (!image) return undefined
  const normalized = image.replace(/\\/g, '/')
  const base = fileName(normalized).toLowerCase()
  if (!base) return undefined

  return Object.entries(portraitModules).find(
    ([path]) => fileName(path).toLowerCase() === base,
  )?.[1]
}
