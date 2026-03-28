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
  paddlePriceId?: string;
}

export const products: Product[] = [
  {
    slug: "kaimatsu-pro-plugin",
    title: "[FEATURED] Kaimatsu Pro Plugin — Ultimate tier",
    shortTitle: "Pro Plugin (Ultimate)",
    price: 14.99,
    currency: "USD",
    badge: "Popular",
    isFeatured: true,
    isSubscription: true,
    billingCycle: "/mo",
    // Paddle catalog: "Premium Access" — $14.99/mo
    paddlePriceId: "pri_01kme6f56f527jczn8gqwbbbg8",
    description:
      "The full Kaimatsu plugin experience — Ultimate tier unlocks every integration, automation, and library feature. Built for editors who want the complete workflow: After Effects & Premiere Pro integration, one-click asset access, and priority updates.",
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
      "Ultimate tier subscription. Plugin license is per-seat and non-transferable. Cancellation stops access at the end of the billing period.",
    imageCount: 3,
  },
  {
    slug: "kaimatsu-pro-plugin-basic",
    title: "Kaimatsu Pro Plugin — Basic tier",
    shortTitle: "Pro Plugin (Basic)",
    price: 5.99,
    currency: "USD",
    badge: "Starter",
    isFeatured: true,
    isSubscription: true,
    billingCycle: "/mo",
    // Paddle catalog: "Basic access" — $5.99/mo
    paddlePriceId: "pri_01kme6e8ksh2c29x6ydrwhzvzf",
    description:
      "Entry-level access to the Kaimatsu plugin ecosystem — perfect if you want core integrations and essential tools without the full Ultimate feature set. Upgrade to Ultimate anytime from your account.",
    features: [
      "Core After Effects & Premiere Pro integration",
      "Essential asset browser & library sync",
      "Standard workflow and layer tools",
      "80+ overlays and textures included in this tier",
      "Monthly updates and bug fixes",
      "Community support via Discord",
      "Compatible with Windows & macOS",
    ],
    disclaimer:
      "Basic tier subscription. Personal and commercial use permitted. Cancellation stops access at the end of the billing period.",
    imageCount: 1,
  },
  {
    slug: "cinematic-transitions-pack",
    title: "Cinematic Transitions Pack",
    shortTitle: "Cinematic Transitions",
    price: 3.99,
    currency: "USD",
    paddlePriceId: "pri_01kmsx9r6rv9m84fhnf3gt3r9r",
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
      "Includes tutorial walkthrough video",
    ],
    disclaimer:
      "One-time purchase. Personal and commercial use permitted. Redistribution or resale of the assets is strictly prohibited.",
    imageCount: 2,
  },
  {
    slug: "sfx-library",
    title: "Sound Effects Library",
    shortTitle: "Sound Effects Library",
    price: 3.99,
    currency: "USD",
    paddlePriceId: "pri_01kmsxbsh993k211ydd40641z3",
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
    title: "Professional LUT Collection",
    shortTitle: "LUT Collection",
    price: 3.99,
    currency: "USD",
    paddlePriceId: "pri_01kmsxfd5qw34va758r3zwzbw3",
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
    paddlePriceId: "pri_01kmsxh198avpws6bd1jvbk2gb",
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
