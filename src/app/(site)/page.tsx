import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

const whyPoints = [
  "Professional-grade plugins and assets built by a working editor, not a faceless company",
  "One subscription gets you the plugin, every asset pack, and continuous updates",
  "Direct access to me through private Discord coaching — real feedback, not generic tutorials",
  "Everything integrates seamlessly with Premiere Pro, After Effects, DaVinci Resolve, and Final Cut",
  "I want your edits to stand out — I'm building tools I actually use in my own workflow every day",
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero */}
      <section className="relative isolate min-h-[min(90vh,920px)] flex flex-col items-center justify-center bg-bg-primary px-6 py-28 md:py-36">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[120px]" />
          <div className="absolute top-1/2 right-[-20%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[100px]" />
          <div className="absolute bottom-0 left-[-15%] h-[360px] w-[360px] rounded-full bg-accent/[0.06] blur-[90px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent animate-fade-in-up stagger-1 [animation-fill-mode:both]">
            Kaimatsu
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up stagger-2 [animation-fill-mode:both]">
            ELEVATE YOUR EDITS
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary md:text-xl animate-fade-in-up stagger-3 [animation-fill-mode:both]">
            Plugins, asset packs, and private coaching — all in one subscription.
          </p>
          <div className="mt-10 animate-fade-in-up stagger-4 [animation-fill-mode:both]">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Testimonials teaser */}
      <section className="border-y border-border-primary bg-bg-secondary px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text-primary sm:text-3xl md:text-4xl">
            DON&apos;T TAKE MY WORD FOR IT
          </h2>
          <p className="mt-5 text-base text-text-secondary md:text-lg">
            See what other editors are saying about Kaimatsu.
          </p>
          <div className="mt-10">
            <Link
              href="/testimonials"
              className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              View feedback
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured products */}
      <section className="bg-bg-primary px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                Our products
              </h2>
              <p className="mt-2 max-w-lg text-text-secondary">
                Plugins, transitions, LUTs, SFX, and coaching — everything you
                need to produce professional edits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-14 flex justify-center border-t border-border-primary pt-12">
            <Link
              href="/catalog"
              className="text-sm font-semibold text-text-secondary underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why me */}
      <section className="border-t border-border-primary bg-bg-tertiary px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-center text-2xl font-bold text-text-primary md:text-3xl">
            Why Kaimatsu?
          </h2>
          <ul className="mt-12 space-y-6">
            {whyPoints.map((point) => (
              <li
                key={point}
                className="flex gap-4 rounded-xl border border-border-primary bg-bg-secondary/60 px-5 py-4 backdrop-blur-sm"
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                  aria-hidden
                />
                <p className="text-[15px] leading-relaxed text-text-secondary md:text-base">
                  {point}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-lg border border-border-accent bg-accent/10 px-8 py-3.5 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
