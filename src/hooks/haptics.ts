import { WebHaptics } from 'web-haptics'

/**
 * One shared haptics instance for the whole site (each instance adds its own hidden switch to the DOM).
 * Android buzzes via the Vibration API; iOS Safari 17.4+ gets the native switch tick; desktop is a no-op.
 *
 * - `tap`    — light tick for picks, steps and toggles
 * - `toggle` — slightly firmer tick for opening/closing a panel
 * - `cta`    — the confident double-tap reserved for the Steam button
 */
type HapticKind = 'tap' | 'toggle' | 'cta'

const presetByKind = { tap: 'selection', toggle: 'light', cta: 'success' } as const

let instance: WebHaptics | null = null
let reduceMotion: MediaQueryList | null = null

export function haptic(kind: HapticKind = 'tap') {
  if (typeof window === 'undefined') return
  reduceMotion ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  // Treat "reduce motion" as "keep the page still" — no buzzing either.
  if (reduceMotion.matches) return
  instance ??= new WebHaptics()
  void instance.trigger(presetByKind[kind]).catch(() => {})
}
