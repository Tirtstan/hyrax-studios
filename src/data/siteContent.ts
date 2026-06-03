import type { NavItem, SocialLink } from '../types/content'

export const navigation: NavItem[] = [
  { label: 'Games', href: '#games' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export const socialLinks: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hyrax_studios/',
    caption: 'Follow studio updates, screenshots, and behind-the-scenes moments.',
  },
  {
    label: 'Itch.io',
    href: 'https://hyrax-studios.itch.io/',
    caption: 'Find playable releases and future jam builds in one place.',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@hyraxstudios',
    caption: 'Short-form clips, devlogs, and studio moments.',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@HyraxStudios-z4e',
    caption: 'Trailers, gameplay, and longer studio updates.',
  },
]
