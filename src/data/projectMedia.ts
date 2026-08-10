const projectMediaModules = import.meta.glob('../assets/Games/Jam Projects/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function fileName(path: string) {
  return path.replace(/\\/g, '/').split('/').pop()?.toLowerCase()
}

export function resolveProjectMedia(file?: string) {
  if (!file) return undefined
  const target = file.toLowerCase()
  return Object.entries(projectMediaModules).find(([path]) => fileName(path) === target)?.[1]
}
