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
    href: 'https://www.instagram.com/rookiegamesza/',
    caption: 'Follow studio updates, screenshots, and behind-the-scenes moments.',
  },
  {
    label: 'Itch.io',
    href: 'https://rookiegamesza.itch.io/',
    caption: 'Find playable releases and future jam builds in one place.',
  },
]
