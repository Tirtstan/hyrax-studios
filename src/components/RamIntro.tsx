import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

/**
 * GET RAMMED's entrance: Fred charges in from the left, rams a rival goat standing on the screen,
 * and the rival is launched over the screenshot leaving a trail before Fred leaps up into his sticker spot.
 * Everything is measured from the live layout, so it lands on the real sticker at any screen size.
 */

type Point = { x: number; y: number }
type Frame = Keyframe & { at: number }

/** Never start before the page's own load-in (logo slam, screen rise) has settled. */
const START_DELAY = 950
const HIT = 600
/** The in-game hitstop: both goats freeze on contact (the rival shuddering) before the launch. */
const HIT_STOP = 230
const LAUNCH = HIT + HIT_STOP
const FLIGHT = 950
const LEAP_START = LAUNCH + 600
const LEAP = 600
const TOTAL = LEAP_START + LEAP + 250
const TRAIL_SEGMENTS = 28

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const quad = (a: Point, c: Point, b: Point, t: number): Point => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y,
})
/** Fast off the hit, slowing as the rival shrinks into the distance. */
const launchEase = (t: number) => 1 - (1 - t) ** 2.2
/** The rival shrinks away to a speck, as if knocked clean off into space, before turning into a star. */
const flightScale = (u: number) => 1 - 0.93 * u ** 1.5

/** One animation per element over the whole timeline, so separate steps never fight over fill. */
function track(element: Element, frames: Frame[]) {
  return element.animate(
    frames.map(({ at, ...rest }) => ({ ...rest, offset: at / TOTAL })),
    { duration: TOTAL, fill: 'both' },
  )
}

/** Comic starburst points in a 100×100 box. */
function burstPoints(spikes: number, outer: number, inner: number) {
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outer * (i % 4 === 0 ? 1 : 0.84) : inner
    const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
    return `${(50 + radius * Math.cos(angle)).toFixed(1)},${(50 + radius * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
}

const OUTER_BURST = burstPoints(11, 48, 27)
const INNER_BURST = burstPoints(9, 31, 17)
const BURST_RAYS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.2
  return { x1: 50 + 54 * Math.cos(angle), y1: 50 + 54 * Math.sin(angle), x2: 50 + 70 * Math.cos(angle), y2: 50 + 70 * Math.sin(angle) }
})

type RamIntroProps = {
  src: string
  stageRef: RefObject<HTMLDivElement | null>
  screenRef: RefObject<HTMLDivElement | null>
  stickerRef: RefObject<HTMLImageElement | null>
  onDone: () => void
}

export function RamIntro({ src, stageRef, screenRef, stickerRef, onDone }: RamIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fredRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef<HTMLSpanElement>(null)
  const rivalRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<SVGSVGElement>(null)
  const twinkleRef = useRef<SVGSVGElement>(null)
  const trailRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const screen = screenRef.current
    const sticker = stickerRef.current
    const root = rootRef.current
    const fred = fredRef.current
    const speed = speedRef.current
    const rival = rivalRef.current
    const impact = impactRef.current
    const twinkle = twinkleRef.current
    const trail = trailRef.current
    if (!stage || !screen || !sticker || !root || !fred || !speed || !rival || !impact || !twinkle || !trail) return

    let cancelled = false
    let animations: Animation[] = []
    let timer = 0
    let observer: IntersectionObserver | undefined

    const play = () => {
      // Everything is placed in the overlay's own pixels; it covers the whole chapter so goats can fly over the title.
      const origin = root.getBoundingClientRect()
      const screenBox = screen.getBoundingClientRect()
      const stickerBox = sticker.getBoundingClientRect()
      const chapterBox = (stage.closest('.game-chapter') ?? stage).getBoundingClientRect()
      const chapterLeft = chapterBox.left - origin.left
      const chapterRight = chapterBox.right - origin.left

      const w = sticker.offsetWidth
      const h = sticker.offsetHeight
      const S = {
        left: screenBox.left - origin.left,
        top: screenBox.top - origin.top,
        width: screenBox.width,
        height: screenBox.height,
      }
      const twinkleSize = 0.42 * w
      root.style.setProperty('--goat-w', `${w}px`)

      /** Where things are, in overlay pixels. */
      const rival0: Point = { x: S.left + Math.max(0.1 * S.width, 0.42 * w), y: S.top + 0.56 * S.height }
      const fredStart: Point = { x: chapterLeft - 0.8 * w, y: rival0.y }
      const contact: Point = { x: rival0.x - 0.52 * w, y: rival0.y }
      const recoil: Point = { x: contact.x - 0.2 * w, y: contact.y }
      const perch: Point = { x: stickerBox.left + stickerBox.width / 2 - origin.left, y: stickerBox.top + stickerBox.height / 2 - origin.top }
      // Clear past the screenshot's right edge; where the screen fills the width (phones) stop just inside the page.
      const pastScreen = S.left + S.width + Math.max(0.5 * w, 0.08 * S.width)
      const launchEnd: Point = { x: Math.min(pastScreen, chapterRight - 0.7 * twinkleSize), y: S.top + 0.18 * S.height }
      const launchControl: Point = { x: lerp(rival0.x, launchEnd.x, 0.45), y: S.top + 0.44 * S.height }
      const leapControl: Point = { x: (recoil.x + perch.x) / 2, y: Math.min(recoil.y, perch.y) - 0.5 * S.height }
      const bang: Point = { x: rival0.x - 0.26 * w, y: rival0.y + 0.06 * h }

      /** Goat transform around its centre; `plant` keeps the hooves on the ground while squashing. */
      const goat = (p: Point, rotate = 0, sx = 1, sy = sx, plant = false) =>
        `translate(${p.x - w / 2}px, ${p.y - h / 2 + (plant ? (1 - sy) * 0.43 * h : 0)}px) rotate(${rotate}deg) scale(${sx}, ${sy})`
      const at = (p: Point, size: number, rest: string) => `translate(${p.x - size / 2}px, ${p.y - size / 2}px) ${rest}`

      // Fred: charge → ram → hit-stop → bounce back → crouch → leap → land on the sticker spot.
      const charge: Frame[] = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8
        const x = lerp(fredStart.x, contact.x, t ** 1.7)
        const y = contact.y - Math.abs(Math.sin(t * Math.PI * 3)) * 0.05 * h
        return { at: lerp(220, HIT, t), transform: goat({ x, y }, 7 + Math.sin(t * Math.PI * 6) * 3) }
      })
      const leap: Frame[] = Array.from({ length: 13 }, (_, i) => {
        const t = i / 12
        const stretch = 1 + Math.sin(t * Math.PI) * 0.07
        return { at: LEAP_START + LEAP * t, transform: goat(quad(recoil, leapControl, perch, t), lerp(-14, 5, t), 2 - stretch, stretch) }
      })
      const fredAnimation = track(fred, [
        { at: 0, transform: goat(fredStart, 7) },
        ...charge,
        { at: HIT, transform: goat({ x: contact.x + 0.04 * w, y: contact.y }, 7, 0.84, 1.1, true) },
        { at: LAUNCH, transform: goat({ x: contact.x + 0.04 * w, y: contact.y }, 7, 0.84, 1.1, true), easing: 'ease-out' },
        { at: LAUNCH + 80, transform: goat({ x: contact.x - 0.1 * w, y: contact.y - 0.14 * h }, -10), easing: 'ease-in' },
        { at: LAUNCH + 200, transform: goat(recoil, -2, 1.06, 0.94, true) },
        { at: LAUNCH + 280, transform: goat(recoil, 0) },
        { at: LEAP_START - 100, transform: goat(recoil, 0), easing: 'ease-out' },
        { at: LEAP_START - 10, transform: goat(recoil, -4, 1.1, 0.86, true) },
        ...leap,
        { at: LEAP_START + LEAP + 70, transform: goat(perch, 5, 1.16, 0.84, true), easing: 'ease-out' },
        { at: LEAP_START + LEAP + 160, transform: goat(perch, 5, 0.96, 1.05, true), easing: 'ease-in-out' },
        { at: TOTAL, transform: goat(perch, 5) },
      ])

      const speedAnimation = track(speed, [
        { at: 0, opacity: 0 },
        { at: 280, opacity: 0.85 },
        { at: HIT, opacity: 0.85 },
        { at: HIT + 100, opacity: 0 },
        { at: TOTAL, opacity: 0 },
      ])

      // The rival: pops in, takes the hit (with a white flash), then flies off spinning.
      const flight: Frame[] = Array.from({ length: 25 }, (_, i) => {
        const t = i / 24
        const u = launchEase(t)
        return {
          at: LAUNCH + FLIGHT * t,
          transform: goat(quad(rival0, launchControl, launchEnd, u), 540 * u, flightScale(u)),
          opacity: t < 0.9 ? 1 : lerp(1, 0, (t - 0.9) / 0.1),
        }
      })
      const rivalAnimation = track(rival, [
        { at: 0, transform: goat(rival0, -10, 0.2, 0.2, true), opacity: 0, filter: 'brightness(1)' },
        { at: 170, transform: goat(rival0, 3, 1.12, 0.9, true), opacity: 1, easing: 'ease-out' },
        { at: 290, transform: goat(rival0, 0, 1), filter: 'brightness(1)' },
        { at: HIT - 1, transform: goat(rival0, 0, 1), filter: 'brightness(1)' },
        // Hitstop: frozen in the squash, shuddering on the spot, flashing white then cooling just before release.
        ...Array.from({ length: Math.floor(HIT_STOP / 30) + 1 }, (_, i): Frame => {
          const shudder = i === 0 ? 0 : (i % 2 ? 1 : -1) * 0.035 * w * (1 - (i * 30) / HIT_STOP / 2)
          return {
            at: Math.min(HIT + i * 30, LAUNCH),
            transform: goat({ x: rival0.x + 0.06 * w + shudder, y: rival0.y }, 0, 0.82, 1.1, true),
            filter: `brightness(${lerp(2.6, 1.5, (i * 30) / HIT_STOP).toFixed(2)})`,
            easing: 'steps(1, end)',
          }
        }),
        { at: LAUNCH, transform: goat({ x: rival0.x + 0.06 * w, y: rival0.y }, 0, 0.82, 1.1, true), filter: 'brightness(1)' },
        ...flight.slice(1),
        { at: TOTAL, transform: flight[flight.length - 1].transform, opacity: 0, filter: 'brightness(1)' },
      ])

      const burstSize = 0.8 * w
      impact.style.width = `${burstSize}px`
      const impactAnimation = track(impact, [
        { at: 0, transform: at(bang, burstSize, 'scale(0)'), opacity: 0 },
        { at: HIT - 1, transform: at(bang, burstSize, 'rotate(-25deg) scale(0.3)'), opacity: 0 },
        { at: HIT, transform: at(bang, burstSize, 'rotate(-25deg) scale(0.3)'), opacity: 1, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)' },
        { at: HIT + 80, transform: at(bang, burstSize, 'rotate(-4deg) scale(1.15)') },
        { at: HIT + 160, transform: at(bang, burstSize, 'rotate(0deg) scale(1)'), opacity: 1 },
        { at: LAUNCH, transform: at(bang, burstSize, 'rotate(2deg) scale(1.04)'), opacity: 1, easing: 'ease-out' },
        { at: LAUNCH + 70, transform: at(bang, burstSize, 'rotate(4deg) scale(1.22)'), opacity: 1, easing: 'ease-in' },
        { at: LAUNCH + 200, transform: at(bang, burstSize, 'rotate(8deg) scale(1.4)'), opacity: 0 },
        { at: TOTAL, transform: at(bang, burstSize, 'scale(0)'), opacity: 0 },
      ])

      twinkle.style.width = `${twinkleSize}px`
      const sparkAt = LAUNCH + FLIGHT - 80
      const twinkleAnimation = track(twinkle, [
        { at: 0, transform: at(launchEnd, twinkleSize, 'rotate(0deg) scale(0)'), opacity: 0 },
        { at: sparkAt, transform: at(launchEnd, twinkleSize, 'rotate(0deg) scale(0)'), opacity: 1, easing: 'ease-out' },
        { at: sparkAt + 130, transform: at(launchEnd, twinkleSize, 'rotate(70deg) scale(1.25)'), easing: 'ease-in-out' },
        { at: sparkAt + 230, transform: at(launchEnd, twinkleSize, 'rotate(100deg) scale(0.85)'), easing: 'ease-in-out' },
        { at: sparkAt + 320, transform: at(launchEnd, twinkleSize, 'rotate(125deg) scale(1.05)'), easing: 'ease-in' },
        { at: sparkAt + 460, transform: at(launchEnd, twinkleSize, 'rotate(200deg) scale(0)'), opacity: 1 },
        { at: TOTAL, transform: at(launchEnd, twinkleSize, 'scale(0)'), opacity: 0 },
      ])

      // The whole site jolts on contact. Shaking the shell's children (not the shell or #root) leaves the
      // fixed backdrop pattern still and keeps fixed elements anchored to the viewport.
      const shell = stage.closest('.site-shell')
      const shakeTargets = shell ? Array.from(shell.children) : [stage]
      const shakes = shakeTargets.map((element) =>
        element.animate(
          [
            { translate: '0 0' },
            { translate: '16px 5px' },
            { translate: '-12px -4px' },
            { translate: '10px 3px' },
            { translate: '-9px -3px' },
            { translate: '7px 2px' },
            { translate: '-4px -1px' },
            { translate: '2px 0' },
            { translate: '0 0' },
          ],
          // Rattles through the hitstop freeze and settles after the launch.
          { delay: HIT, duration: HIT_STOP + 340, easing: 'ease-out', composite: 'add' },
        ),
      )

      // Trail: short segments that appear as the rival passes and taper with its shrinking size.
      const layers = [
        { className: 'ram-intro__trail-ink', width: (scale: number) => 0.24 * h * scale + 6 },
        { className: 'ram-intro__trail-pop', width: (scale: number) => 0.24 * h * scale },
        { className: 'ram-intro__trail-core', width: (scale: number) => 0.09 * h * scale },
      ]
      const trailAnimations = layers.flatMap(({ className, width }) => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        group.setAttribute('class', className)
        trail.append(group)
        return Array.from({ length: TRAIL_SEGMENTS }, (_, i) => {
          const t0 = i / TRAIL_SEGMENTS
          const t1 = (i + 1) / TRAIL_SEGMENTS
          const a = quad(rival0, launchControl, launchEnd, launchEase(t0))
          const b = quad(rival0, launchControl, launchEnd, launchEase(t1))
          const stroke = width(flightScale(launchEase(t0)))
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', a.x.toFixed(1))
          line.setAttribute('y1', a.y.toFixed(1))
          line.setAttribute('x2', b.x.toFixed(1))
          line.setAttribute('y2', b.y.toFixed(1))
          group.append(line)
          return line.animate(
            [
              { opacity: 1, strokeWidth: `${stroke}px` },
              { opacity: 1, strokeWidth: `${stroke}px`, offset: 0.4 },
              { opacity: 0, strokeWidth: `${stroke * 0.25}px` },
            ],
            { delay: LAUNCH + FLIGHT * t1, duration: Math.min(760, TOTAL - LAUNCH - FLIGHT * t1), easing: 'ease-in', fill: 'forwards' },
          )
        })
      })

      root.classList.add('is-playing')
      animations = [fredAnimation, speedAnimation, rivalAnimation, impactAnimation, twinkleAnimation, ...shakes, ...trailAnimations]
      fredAnimation.finished.then(() => !cancelled && onDone()).catch(() => {})
    }

    const ready = Promise.all([
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, START_DELAY)
      }),
      // Wait until the screen is well into view, so a page opened further down still gets the show.
      new Promise<void>((resolve) => {
        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return
            observer?.disconnect()
            resolve()
          },
          { rootMargin: '-20% 0px -20% 0px' },
        )
        observer.observe(screen)
      }),
      sticker.decode().catch(() => {}),
    ])
    void ready.then(() => {
      if (!cancelled) play()
    })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      observer?.disconnect()
      animations.forEach((animation) => animation.cancel())
      trail.replaceChildren()
    }
  }, [stageRef, screenRef, stickerRef, onDone])

  return (
    <div ref={rootRef} className="ram-intro" aria-hidden="true">
      <svg ref={trailRef} className="ram-intro__trail" />
      <div ref={rivalRef} className="ram-intro__goat ram-intro__goat--rival">
        <img src={src} alt="" />
      </div>
      <div ref={fredRef} className="ram-intro__goat">
        <span ref={speedRef} className="ram-intro__speed" />
        <img src={src} alt="" />
      </div>
      <svg ref={impactRef} className="ram-intro__impact" viewBox="0 0 100 100">
        <g className="ram-intro__rays">
          {BURST_RAYS.map((ray, i) => (
            <line key={i} {...ray} />
          ))}
        </g>
        <polygon className="ram-intro__burst-outer" points={OUTER_BURST} />
        <polygon className="ram-intro__burst-inner" points={INNER_BURST} />
      </svg>
      <svg ref={twinkleRef} className="ram-intro__twinkle" viewBox="0 0 100 100">
        <path d="M50 2C54 38 62 46 98 50C62 54 54 62 50 98C46 62 38 54 2 50C38 46 46 38 50 2Z" />
      </svg>
    </div>
  )
}
