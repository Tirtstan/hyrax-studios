const mediaModules = import.meta.glob('../assets/Games/**/*.{png,jpg,jpeg,webp,mp4,webm}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp'])

function normalize(value: string) {
  return value.replace(/\\/g, '/').toLowerCase()
}

function fileName(path: string) {
  return path.replace(/\\/g, '/').split('/').pop() ?? path
}

function relativeTo(path: string, assetFolder: string) {
  const norm = path.replace(/\\/g, '/')
  const marker = `/Games/${assetFolder}/`
  const i = norm.indexOf(marker)
  return i === -1 ? undefined : norm.slice(i + marker.length)
}

function inFolder(path: string, assetFolder: string) {
  return normalize(path).includes(`/games/${normalize(assetFolder)}/`)
}

export function resolveGameMedia(assetFolder: string, file?: string) {
  if (!file) return undefined
  const target = normalize(file)

  return Object.entries(mediaModules).find(([path]) => {
    if (!inFolder(path, assetFolder)) return false
    const rel = relativeTo(path, assetFolder)
    return normalize(fileName(path)) === target || normalize(rel ?? '') === target
  })?.[1]
}

export function getAutoGalleryImages(assetFolder: string, galleryFolder?: string) {
  return Object.entries(mediaModules)
    .filter(([path]) => {
      if (!inFolder(path, assetFolder)) return false
      if (!IMAGE_EXTENSIONS.has(fileName(path).split('.').pop()?.toLowerCase() ?? '')) return false
      if (!galleryFolder) return true
      const rel = relativeTo(path, assetFolder)
      return normalize(rel ?? '').startsWith(`${normalize(galleryFolder)}/`)
    })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => ({
      file: relativeTo(path, assetFolder) ?? fileName(path),
      src,
    }))
}
