export interface Product {
  slug: string;
  title: string;
  shortTitle: string;
  price: number;
  originalPrice?: number;
  currency: string;
  badge?: string;
  hasVariants?: boolean;
  variantLabel?: string;
  variants?: string[];
  variantDescriptions?: Record<string, string>;
  description: string;
  features: string[];
  controls?: Record<string, string>;
  disclaimer: string;
  imageCount: number;
  isFeatured?: boolean;
  isSubscription?: boolean;
  billingCycle?: string;
}

export const products: Product[] = [
  {
    slug: "kaimatsu-pro-plugin",
    title: "[FEATURED] Kaimatsu Pro Plugin",
    shortTitle: "Kaimatsu Pro Plugin",
    price: 14.99,
    currency: "USD",
    badge: "Popular",
    isFeatured: true,
    isSubscription: true,
    billingCycle: "/mo",
    description:
      "The flagship Kaimatsu plugin — built from the ground up to streamline your editing workflow. Integrates directly with After Effects and Premiere Pro, giving you one-click access to every asset pack in the Kaimatsu library plus exclusive automation tools that save you hours per project.",
    features: [
      "Full After Effects & Premiere Pro integration",
      "One-click asset browser built into your timeline",
      "Auto-sync with your Kaimatsu asset library",
      "Smart layer management & project organizer",
      "Batch render presets with custom export profiles",
      "Real-time preview of all effects and transitions",
      "Drag-and-drop workflow for overlays, LUTs, and SFX",
      "Custom expression builder with templates",
      "Automatic updates with new features monthly",
      "Priority support via Discord",
      "Compatible with Windows & macOS",
    ],
    disclaimer:
      "Subscription required. Plugin license is per-seat and non-transferable. Cancellation stops access at the end of the billing period.",
    imageCount: 3,
  },
  {
    slug: "cinematic-transitions-pack",
    title: "[30% OFF] Cinematic Transitions Pack",
    shortTitle: "Cinematic Transitions Pack",
    price: 29.99,
    originalPrice: 42.99,
    currency: "USD",
    badge: "Sale",
    description:
      "120+ handcrafted cinematic transitions designed for professional editors. Includes whip pans, light leaks, glitch cuts, zoom transitions, and film burn effects. Drag and drop directly into your timeline — works standalone or integrated with the Kaimatsu plugin.",
    features: [
      "120+ unique transition presets",
      "Whip pans, light leaks, and glitch cuts",
      "Zoom and film burn transitions",
      "4K resolution, all frame rates supported",
      "Works in Premiere Pro, After Effects, DaVinci Resolve, Final Cut",
      "Drag-and-drop — no plugins required for standalone use",
      "Kaimatsu plugin integration for one-click access",
      "Color-customizable overlays",
      "Includes tutorial walkthrough video",
    ],
    disclaimer:
      "One-time purchase. Personal and commercial use permitted. Redistribution or resale of the assets is strictly prohibited.",
    imageCount: 2,
  },
  {
    slug: "editor-essentials-bundle",
    title: "[BEST VALUE] Editor Essentials Bundle",
    shortTitle: "Editor Essentials Bundle",
    price: 49.99,
    originalPrice: 79.99,
    currency: "USD",
    badge: "Sale",
    hasVariants: true,
    variantLabel: "Tier",
    variants: ["Starter", "Complete", "Ultimate"],
    variantDescriptions: {
      Starter:
        "Includes the Cinematic Transitions Pack and Sound Effects Library. Great for editors starting out.",
      Complete:
        "Everything in Starter plus the LUT Collection, Overlay Pack, and Typography Templates.",
      Ultimate:
        "The full Kaimatsu asset library — every pack, every update, plus 1 month of Discord coaching included.",
    },
    description:
      "Everything you need to produce professional-quality edits in one bundle. Handpicked from the best of the Kaimatsu library and packaged at a steep discount. Whether you edit YouTube videos, short-form content, or client work — this bundle covers you.",
    features: [
      "Cinematic Transitions Pack (120+ presets)",
      "Sound Effects Library (200+ SFX)",
      "Professional LUT Collection (50+ color grades)",
      "Overlay & Texture Pack (80+ overlays)",
      "Typography & Title Templates (40+ designs)",
      "Motion Graphics Elements (60+ assets)",
      "All future updates included",
      "Works with Premiere Pro, After Effects, DaVinci Resolve, Final Cut",
      "Kaimatsu plugin integration",
    ],
    disclaimer:
      "One-time purchase. Personal and commercial use permitted. Redistribution or resale of the assets is strictly prohibited.",
    imageCount: 4,
    isFeatured: true,
  },
  {
    slug: "sfx-library",
    title: "Sound Effects Library",
    shortTitle: "Sound Effects Library",
    price: 19.99,
    currency: "USD",
    description:
      "200+ royalty-free sound effects curated for video editors. Whooshes, impacts, risers, UI sounds, ambient textures, and more. Organized by category and ready to drop into your timeline. Every sound is original and cleared for commercial use.",
    features: [
      "200+ royalty-free sound effects",
      "Whooshes, impacts, risers, and stingers",
      "UI sounds and button clicks",
      "Ambient textures and atmospheres",
      "WAV format, 48kHz / 24-bit",
      "Organized by category for fast browsing",
      "Kaimatsu plugin integration for one-click import",
      "Cleared for commercial and client work",
    ],
    disclaimer:
      "One-time purchase. Royalty-free for personal and commercial use. Redistribution or resale of the audio files is prohibited.",
    imageCount: 1,
  },
  {
    slug: "lut-collection",
    title: "[NEW] Professional LUT Collection",
    shortTitle: "LUT Collection",
    price: 24.99,
    currency: "USD",
    badge: "New",
    description:
      "50+ cinematic color grades designed for modern content. From warm analog film looks to cold desaturated tones — every LUT is built to work across a range of footage and lighting conditions. Previews included so you can browse before applying.",
    features: [
      "50+ cinematic LUTs (.cube format)",
      "Film emulation, warm tones, cold tones, vintage, modern",
      "Works in Premiere Pro, DaVinci Resolve, Final Cut, After Effects",
      "Preview thumbnails for every LUT",
      "Adjustable intensity — stack and blend",
      "Optimized for LOG and Rec.709 footage",
      "Kaimatsu plugin integration",
    ],
    disclaimer:
      "One-time purchase. Personal and commercial use permitted. Redistribution or resale is prohibited.",
    imageCount: 2,
  },
  {
    slug: "discord-coaching",
    title: "[LIMITED] Private Discord Coaching",
    shortTitle: "Discord Coaching",
    price: 39.99,
    currency: "USD",
    badge: "Limited",
    isSubscription: true,
    billingCycle: "/mo",
    isFeatured: true,
    description:
      "Get direct access to me in a private Discord channel. Weekly group sessions, personalized feedback on your edits, workflow reviews, and priority Q&A. This is for editors who want to accelerate their growth with hands-on guidance — not just tutorials.",
    features: [
      "Private Discord channel access",
      "Weekly live group coaching sessions",
      "Personalized edit feedback and reviews",
      "Workflow audits — I review your project files",
      "Priority Q&A — ask me anything, anytime",
      "Early access to new packs and plugin features",
      "Exclusive coaching-only assets and presets",
      "Access to the private coaching community",
      "Cancel anytime — no contracts",
    ],
    disclaimer:
      "Monthly subscription. Access continues until the end of your billing period upon cancellation. Coaching content and recordings are for personal use only.",
    imageCount: 1,
  },
  {
    slug: "overlay-texture-pack",
    title: "Overlay & Texture Pack",
    shortTitle: "Overlay & Texture Pack",
    price: 17.99,
    currency: "USD",
    description:
      "80+ high-resolution overlays and textures to add depth, grain, and atmosphere to your edits. Includes film grain, dust particles, light leaks, bokeh, lens flares, and paper textures. Layer them on top of your footage for an instant cinematic look.",
    features: [
      "80+ overlays and textures",
      "Film grain, dust, and particle effects",
      "Light leaks and lens flares",
      "Bokeh and out-of-focus textures",
      "Paper and grunge textures",
      "4K resolution, ProRes and PNG formats",
      "Drag-and-drop ready",
      "Kaimatsu plugin integration",
    ],
    disclaimer:
      "One-time purchase. Personal and commercial use permitted. Redistribution or resale is prohibited.",
    imageCount: 1,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function formatPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  return `${symbol}${price.toFixed(2)} ${currency}`;
}
