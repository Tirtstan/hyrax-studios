import logoSrc from '../assets/brand/logo.svg'
import wordmarkSrc from '../assets/brand/HyraxText.svg'

type BrandMarkProps = {
  compact?: boolean
  dense?: boolean
}

export function BrandMark({ compact = false, dense = false }: BrandMarkProps) {
  return (
    <div className={compact ? 'brand-lockup' : 'brand-mark'}>
      <div className="flex items-center gap-3 sm:gap-5">
        <img
          src={logoSrc}
          alt=""
          width={200}
          height={120}
          decoding="async"
          className={
            compact
              ? 'h-8 w-auto shrink-0 object-contain sm:h-10'
              : dense
                ? 'h-12 w-auto shrink-0 object-contain sm:h-14'
                : 'h-17 w-auto shrink-0 object-contain sm:h-24'
          }
        />
        <img
          src={wordmarkSrc}
          alt="Hyrax Studios"
          width={1038}
          height={323}
          decoding="async"
          className={
            compact
              ? 'h-5 max-w-[min(100%,9rem)] w-auto shrink-0 object-contain object-left sm:h-7 sm:max-w-[min(100%,12rem)]'
              : dense
                ? 'h-8 max-w-[min(100%,15rem)] w-auto shrink-0 object-contain object-left sm:h-10 sm:max-w-[min(100%,18rem)]'
                : 'h-10 max-w-[min(100%,18rem)] w-auto shrink-0 object-contain object-left sm:h-14 sm:max-w-[min(100%,22rem)] lg:h-16'
          }
        />
      </div>
    </div>
  )
}
