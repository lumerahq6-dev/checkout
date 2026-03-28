import type { Metadata } from "next";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Testimonials – Kaimatsu",
  description:
    "Read what editors say about Kaimatsu plugins, asset packs, and coaching.",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={
            i < rating ? "h-5 w-5 text-yellow-400" : "h-5 w-5 text-text-muted/40"
          }
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const staggerClass = (index: number) => {
  const n = (index % 3) + 1;
  return n === 1 ? "stagger-1" : n === 2 ? "stagger-2" : "stagger-3";
};

export default function TestimonialsPage() {
  return (
    <div className="relative isolate overflow-hidden bg-bg-primary px-6 py-20 md:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-1/4 left-[-15%] h-[380px] w-[380px] rounded-full bg-accent/[0.07] blur-[90px]" />
        <div className="absolute bottom-1/4 right-[-10%] h-[340px] w-[340px] rounded-full bg-accent/[0.05] blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_40%_at_50%_-10%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent animate-fade-in-up stagger-1 [animation-fill-mode:both]">
            Feedback
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl animate-fade-in-up stagger-2 [animation-fill-mode:both]">
            What Our Customers Say
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up stagger-3 [animation-fill-mode:both]">
            Real reviews from editors who use Kaimatsu plugins and assets in
            their work.
          </p>
        </div>

        <ul className="mt-16 grid list-none grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-7 lg:gap-8">
          {testimonials.map((t, index) => (
            <li
              key={`${t.name}-${t.product}`}
              className={`animate-fade-in-up [animation-fill-mode:both] ${staggerClass(index)}`}
            >
              <article className="flex h-full flex-col rounded-2xl border border-border-primary bg-bg-card p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-[border-color,background-color] hover:border-border-accent/50 hover:bg-bg-card-hover md:p-8">
                <StarRating rating={t.rating} />
                <blockquote className="mt-5 flex-1">
                  <p className="text-[15px] leading-relaxed text-text-primary md:text-base">
                    <span className="text-accent/90">&ldquo;</span>
                    {t.message}
                    <span className="text-accent/90">&rdquo;</span>
                  </p>
                </blockquote>
                <footer className="mt-8 border-t border-border-primary pt-6">
                  <p className="font-semibold text-text-primary">{t.name}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">{t.role}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                    Reviewing:{" "}
                    <span className="text-accent">{t.product}</span>
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
