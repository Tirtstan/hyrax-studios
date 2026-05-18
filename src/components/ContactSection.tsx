import { useEffect, useRef, useState } from 'react'

import instagramIcon from '../assets/logos/instagram-white.svg'
import itchioIcon from '../assets/logos/itchio-textless-white.svg'
import { socialLinks } from '../data/siteContent'

const iconByLabel: Record<string, string> = {
  Instagram: instagramIcon,
  'Itch.io': itchioIcon,
}

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeYVjISuv1RdAwiLpKYWK8IGgPuWSsJQ2Ppz_qQpANXTZ9cbg/viewform?usp=sharing&ouid=102722259160060368500'
const GOOGLE_FORM_EMBED_URL = `${GOOGLE_FORM_URL}&embedded=true`

export function ContactSection() {
  const [formSrc, setFormSrc] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Preload the iframe as soon as the section enters the viewport (nav click or natural scroll).
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFormSrc(GOOGLE_FORM_EMBED_URL)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Auto-expand form once the trigger sentinel is fully scrolled into view.
  useEffect(() => {
    const el = triggerRef.current
    if (!el || formOpen) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFormOpen(true)
          obs.disconnect()
        }
      },
      { threshold: 1.0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [formOpen])

  return (
    <footer id="contact" ref={sectionRef} className="px-4 py-8 pb-14 sm:px-6 sm:py-10 sm:pb-20">
      <div className="content-shell">
        <div className="footer-card">

          {/* ── Contact intro ── */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-(--brand-coral)">
              Reach
            </p>
            <h3 className="text-2xl font-black uppercase leading-tight text-(--ink) sm:text-3xl">
              Contact
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-(--muted)">
              For studio enquiries, press, or general contact, reach out to the main Hyrax inbox.
            </p>
          </div>

          {/* ── Buttons & social ── */}
          <div className="flex flex-wrap items-center gap-3">
            <a href="mailto:admin@hyrax-studios.com" className="primary-cta">
              Email Directly
            </a>
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="secondary-cta">
              Open in Google Forms
            </a>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
              >
                <span className="footer-social-link__icon">
                  <img src={iconByLabel[link.label]} alt="" aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* ── Footer meta ── */}
          <div className="footer-meta">
            <span>Hyrax Studios (PTY) Ltd</span>
            <span>Founded February 2026</span>
            <span>Cape Town, South Africa</span>
          </div>

          {/* ── Scroll sentinel + toggle ── */}
          <div ref={triggerRef} className="contact-form-trigger">
            <div className="contact-form-trigger__line" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className={`contact-form-toggle${formOpen ? ' is-open' : ''}`}
              aria-expanded={formOpen}
              aria-controls="contact-form-drawer"
            >
              <span>Contact Form</span>
              <svg
                className="contact-form-toggle__arrow"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 5.5 7 9.5 11 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="contact-form-trigger__line" aria-hidden="true" />
          </div>

          {/* ── Expandable form drawer ── */}
          <div
            id="contact-form-drawer"
            className={`contact-form-drawer${formOpen ? ' is-open' : ''}`}
          >
            <div className="contact-form-drawer__inner">
              <div className="contact-form-shell">
                {formSrc ? (
                  <iframe
                    src={formSrc}
                    title="Hyrax Studios contact form"
                    className="contact-form-embed"
                  >
                    Loading…
                  </iframe>
                ) : (
                  <div className="contact-form-loading">
                    <span>Loading form…</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
