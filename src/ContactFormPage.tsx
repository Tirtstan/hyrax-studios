import './App.css'

import { BrandMark } from './components/BrandMark'
import { socialLinks } from './data/siteContent'

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeYVjISuv1RdAwiLpKYWK8IGgPuWSsJQ2Ppz_qQpANXTZ9cbg/viewform?usp=sharing&ouid=102722259160060368500'
const GOOGLE_FORM_EMBED_URL = `${GOOGLE_FORM_URL}&embedded=true`

export function ContactFormPage() {
  return (
    <div className="site-shell">
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="content-shell space-y-6">
          <header className="section-card px-4 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <a href="/" className="inline-flex text-(--ink) no-underline">
                  <BrandMark compact />
                </a>
                <div className="max-w-3xl space-y-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-(--brand-teal)">
                    Contact
                  </p>
                  <h1 className="font-display text-3xl uppercase leading-none text-(--ink) sm:text-4xl lg:text-5xl">
                    Send Hyrax a message
                  </h1>
                  <p className="text-sm leading-7 text-(--muted) sm:text-base">
                    Use the form below for studio enquiries, press, collabs, or anything else you
                    want to send our way.
                  </p>
                </div>
              </div>

              <div className="contact-page-actions flex flex-wrap gap-3">
                <a href="/" className="secondary-cta">
                  Back to Home
                </a>
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="primary-cta">
                  Open in Google Forms
                </a>
              </div>
            </div>
          </header>

          <section className="section-card p-3 sm:p-5 lg:p-6">
            <div className="contact-form-shell">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Hyrax Studios contact form"
                className="contact-form-embed"
              >
                Loading…
              </iframe>
            </div>
          </section>

          <section className="section-card px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase text-(--ink) sm:text-2xl">
                  Prefer another route?
                </h2>
                <p className="text-sm leading-7 text-(--muted)">
                  You can also email us directly at{' '}
                  <a href="mailto:admin@hyrax-studios.com" className="about-link">
                    admin@hyrax-studios.com
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
