import instagramIcon from '../assets/logos/instagram-white.svg'
import itchioIcon from '../assets/logos/itchio-textless-white.svg'
import { socialLinks } from '../data/siteContent'

const iconByLabel: Record<string, string> = {
  Instagram: instagramIcon,
  'Itch.io': itchioIcon,
}

export function ContactSection() {
  return (
    <footer id="contact" className="px-4 py-8 pb-14 sm:px-6 sm:py-10 sm:pb-20">
      <div className="content-shell">
        <div className="footer-card">
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

          <div className="flex flex-wrap items-center gap-3">
            <a href="/contact.html" className="primary-cta">
              Open Contact Form
            </a>
            <a href="mailto:admin@hyrax-studios.com" className="secondary-cta">
              Email Instead
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

          <div className="footer-meta">
            <span>Hyrax Studios (PTY) Ltd</span>
            <span>Founded February 2026</span>
            <span>Cape Town, South Africa</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
