export type NavItem = {
    label: string;
    href: `#${string}`;
};

export type HeroStat = {
    label: string;
    value: string;
};

export type GameLinkKind = "steam" | "itch" | "anchor" | "external";

export type GameLink = {
    label: string;
    kind: GameLinkKind;
    href?: string;
    prominent?: boolean;
    pendingLabel?: string;
};

export type GameGalleryItem = {
    type: "image" | "video";
    file: string;
    alt: string;
    caption?: string;
};

export type Game = {
    id: string;
    featured?: boolean;
    title: string;
    summary: string;
    description: string[];
    status: string;
    accentColor?: string;
    tags: string[];
    links: GameLink[];
    assetFolder: string;
    heroCharacterFile?: string;
    heroCharacterAlt?: string;
    titleImageFile?: string;
    galleryFolder?: string;
    gallery: GameGalleryItem[];
};

export type SmallProject = {
    id: string;
    title: string;
    summary: string;
    event: string;
    year: string;
    href?: string;
    image?: string;
    imageAlt?: string;
};

export type SocialLink = {
    label: string;
    href: string;
    caption: string;
};

export type PersonLinkKind = "email" | "itch" | "website" | "twitter";

export type PersonLink = {
    kind: PersonLinkKind;
    href: string;
};

export type PersonStatus = "active" | "alumni";

export type Person = {
    id: string;
    name: string;
    role: string;
    focus: string;
    blurb: string;
    accent: string;
    image?: string;
    links: PersonLink[];
    /** Defaults to active. Alumni appear under the Originals band. */
    status?: PersonStatus;
};
