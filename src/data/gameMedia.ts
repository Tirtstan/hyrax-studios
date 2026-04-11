const mediaModules = import.meta.glob('../assets/Games/**/*.{png,jpg,jpeg,webp,mp4,webm}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp'])

function normalizePathSegment(value: string) {
  return value.replace(/\\/g, '/').toLowerCase()
}

function getFileName(path: string) {
  const normalizedPath = path.replace(/\\/g, '/')
  return normalizedPath.split('/').pop() ?? normalizedPath
}

function getAssetRelativePath(path: string, assetFolder: string) {
  const normalizedPath = path.replace(/\\/g, '/')
  const marker = `/Games/${assetFolder}/`
  const markerIndex = normalizedPath.indexOf(marker)

  if (markerIndex === -1) {
    return undefined
  }

  return normalizedPath.slice(markerIndex + marker.length)
}

function isInAssetFolder(path: string, assetFolder: string) {
  return normalizePathSegment(path).includes(`/games/${normalizePathSegment(assetFolder)}/`)
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

export function resolveGameMedia(assetFolder: string, fileName?: string) {
  if (!fileName) {
    return undefined
  }

  const normalizedFileName = normalizePathSegment(fileName)

  return Object.entries(mediaModules).find(([path]) => {
    const assetRelativePath = getAssetRelativePath(path, assetFolder)

    return (
      isInAssetFolder(path, assetFolder) &&
      (normalizePathSegment(getFileName(path)) === normalizedFileName ||
        normalizePathSegment(assetRelativePath ?? '') === normalizedFileName)
    )
  })?.[1]
}

export function getAutoGalleryImages(assetFolder: string, galleryFolder?: string) {
  return Object.entries(mediaModules)
    .filter(([path]) => {
      const fileName = getFileName(path)
      const assetRelativePath = getAssetRelativePath(path, assetFolder)
      const isInGalleryFolder = galleryFolder
        ? normalizePathSegment(assetRelativePath ?? '').startsWith(`${normalizePathSegment(galleryFolder)}/`)
        : true

      return (
        isInAssetFolder(path, assetFolder) &&
        isInGalleryFolder &&
        IMAGE_EXTENSIONS.has(getFileExtension(fileName))
      )
    })
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([path, src]) => ({
      file: getAssetRelativePath(path, assetFolder) ?? getFileName(path),
      src,
    }))
}
