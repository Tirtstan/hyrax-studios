type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const isCentered = align === 'center'

  return (
    <div
      data-reveal
      className={[
        'section-heading max-w-3xl space-y-4',
        isCentered ? 'mx-auto text-center' : 'text-left',
      ].join(' ')}
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-(--brand-teal)">
        {eyebrow}
      </p>
      <div className="space-y-3">
        <h2 className="font-display text-3xl uppercase leading-none text-(--ink) sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-sm leading-7 text-(--muted) sm:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}
