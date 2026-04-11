const LOGO_SRC = '/brand/logo.svg'
const WORDMARK_SRC = '/brand/HyraxText.svg'

type BrandMarkProps = {
  compact?: boolean
  stacked?: boolean
  dense?: boolean
}

export function BrandMark({ compact = false, stacked = false, dense = false }: BrandMarkProps) {
  const useStackedLayout = !compact && stacked

  return (
    <div className={compact ? 'brand-lockup' : 'brand-mark'}>
      <div
        className={
          useStackedLayout
            ? 'flex flex-col items-center gap-4 text-center'
            : 'flex items-center gap-3 sm:gap-5'
        }
      >
        <img
          src={LOGO_SRC}
          alt=""
          width={200}
          height={120}
          decoding="async"
          className={
            compact
              ? 'h-10 w-auto shrink-0 object-contain'
              : dense
                ? 'h-12 w-auto shrink-0 object-contain sm:h-14'
                : 'h-17 w-auto shrink-0 object-contain sm:h-24'
          }
        />
        <img
          src={WORDMARK_SRC}
          alt="Hyrax Studios"
          width={1038}
          height={323}
          decoding="async"
          className={
            compact
              ? 'h-7 max-w-[min(100%,12rem)] w-auto shrink-0 object-contain object-left'
              : dense
                ? 'h-8 max-w-[min(100%,15rem)] w-auto shrink-0 object-contain object-left sm:h-10 sm:max-w-[min(100%,18rem)]'
                : 'h-10 max-w-[min(100%,18rem)] w-auto shrink-0 object-contain object-left sm:h-14 sm:max-w-[min(100%,22rem)] lg:h-16'
          }
        />
      </div>
    </div>
  )
}
