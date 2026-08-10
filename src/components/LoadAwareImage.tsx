import { useState } from 'react'
import type { ImgHTMLAttributes, SyntheticEvent } from 'react'

type LoadAwareImageProps = ImgHTMLAttributes<HTMLImageElement>

export function LoadAwareImage({ className = '', onError, onLoad, ...props }: LoadAwareImageProps) {
  const [loaded, setLoaded] = useState(false)

  const revealImage = (event: SyntheticEvent<HTMLImageElement>) => {
    onLoad?.(event)

    const image = event.currentTarget
    image.decode().then(
      () => setLoaded(true),
      () => setLoaded(true),
    )
  }

  const revealBrokenImage = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true)
    onError?.(event)
  }

  return (
    <img
      {...props}
      className={`${className} load-aware-image${loaded ? ' is-loaded' : ''}`.trim()}
      onLoad={revealImage}
      onError={revealBrokenImage}
    />
  )
}
