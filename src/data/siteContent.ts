import type {
  NavItem,
  SocialLink,
  StudioValue,
} from '../types/content'

export const navigation: NavItem[] = [
  { label: 'Games', href: '#games' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export const studioValues: StudioValue[] = [
  {
    title: 'High-Energy Gameplay',
    description:
      'Every project aims for immediate momentum, readable interaction, and satisfying escalation.',
  },
  {
    title: 'Playful Experimentation',
    description:
      'Concepts are explored quickly, tested often, and refined around the strongest player response.',
  },
  {
    title: 'Polished Loops',
    description:
      'The team focuses on repeatable moment-to-moment fun rather than one-off novelty.',
  },
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
