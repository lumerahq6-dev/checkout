import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products – Kaimatsu",
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="relative isolate overflow-hidden border-b border-border-primary px-6 py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-24 left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.1] blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(139,92,246,0.12),transparent_55%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent animate-fade-in-up [animation-fill-mode:both]">
            Catalog
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl animate-fade-in-up [animation-fill-mode:both] [animation-delay:80ms]">
            Products
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up [animation-fill-mode:both] [animation-delay:160ms]">
            Plugins, asset packs, and coaching plans — browse everything
            and find the right fit for your editing workflow.
          </p>
        </div>
      </section>

      <section className="bg-bg-secondary/40 px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-7 lg:gap-8">
            {products.map((product, index) => (
              <div
                key={product.slug}
                className="animate-fade-in-up [animation-fill-mode:both]"
                style={{ animationDelay: `${220 + index * 90}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
