"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

interface ProductDetailProps {
  product: Product;
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      aria-hidden
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const variants = product.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState(
    variants[0] ?? ""
  );

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const imageCount = Math.max(1, product.imageCount);
  const safeImageIndex = Math.min(imageIndex, imageCount - 1);

  const variantNote = useMemo(() => {
    if (!selectedVariant || !product.variantDescriptions) return null;
    return product.variantDescriptions[selectedVariant] ?? null;
  }, [product.variantDescriptions, selectedVariant]);

  const copyShare = useCallback(async () => {
    const url = shareUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const incrementQty = () => setQuantity((q) => Math.min(99, q + 1));
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  const buyHref =
    product.paddlePriceId != null
      ? `/buy/${product.buyPath}${quantity > 1 ? `?qty=${quantity}` : ""}`
      : null;

  return (
    <div className="bg-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Gallery */}
          <div className="animate-fade-in-up [animation-fill-mode:both]">
            <div className="relative overflow-hidden rounded-2xl border border-border-primary bg-bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-primary">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.12), transparent 40%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="rounded-3xl border border-border-accent/40 bg-accent/5 p-8 shadow-[0_0_60px_rgba(139,92,246,0.12)]">
                    <VideoIcon className="text-accent" />
                  </div>
                  <p className="text-center text-sm font-medium text-text-secondary">
                    Preview {safeImageIndex + 1} of {imageCount}
                  </p>
                </div>

                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-md bg-sale px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border-primary bg-bg-secondary/80 px-4 py-3 backdrop-blur-sm">
                <span className="text-xs font-medium tabular-nums text-text-muted">
                  {safeImageIndex + 1} / {imageCount}
                </span>
                <div className="flex gap-1.5" role="tablist" aria-label="Image thumbnails">
                  {Array.from({ length: imageCount }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === safeImageIndex}
                      aria-label={`Image ${i + 1}`}
                      onClick={() => setImageIndex(i)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        i === safeImageIndex
                          ? "w-6 bg-accent"
                          : "w-2 bg-text-muted/40 hover:bg-text-muted/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col animate-fade-in-up stagger-1 [animation-fill-mode:both]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Kaimatsu
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-text-primary">
                {formatPrice(product.price, product.currency)}
                {product.billingCycle && (
                  <span className="text-base font-normal text-text-muted">
                    {product.billingCycle}
                  </span>
                )}
              </span>
              {product.originalPrice != null && (
                <span className="text-lg text-text-muted line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            {product.hasVariants && variants.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {product.variantLabel ?? "Option"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedVariant === v
                          ? "border-accent bg-accent/15 text-text-primary ring-1 ring-border-accent"
                          : "border-border-primary bg-bg-tertiary text-text-secondary hover:border-border-accent hover:text-text-primary"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {variantNote && (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {variantNote}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Quantity
              </p>
              <div className="mt-3 inline-flex items-center rounded-xl border border-border-primary bg-bg-card">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="flex h-11 w-11 items-center justify-center text-lg font-medium text-text-primary transition-colors hover:bg-bg-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums text-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="flex h-11 w-11 items-center justify-center text-lg font-medium text-text-primary transition-colors hover:bg-bg-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-10">
              {buyHref ? (
                <Link
                  href={buyHref}
                  className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Buy now
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-border-primary bg-bg-tertiary py-3.5 text-sm font-semibold text-text-muted"
                >
                  Coming soon
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description & details */}
        <section className="mt-16 border-t border-border-primary pt-14 md:mt-20 md:pt-16">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary sm:text-2xl">
            TAKE YOUR EDITS TO THE NEXT LEVEL
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-accent">
            EVERYTHING YOU NEED IN ONE SUBSCRIPTION
          </p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
            {product.description}
          </p>

          <h3 className="mt-12 font-display text-lg font-bold text-text-primary">
            What&apos;s included?
          </h3>
          {product.features.length > 0 ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 rounded-xl border border-border-primary bg-bg-card px-4 py-3 text-sm text-text-secondary"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-text-muted">
              Full feature list is being finalized — check back soon or reach
              out on Discord for early access details.
            </p>
          )}

          {product.controls && Object.keys(product.controls).length > 0 && (
            <div className="mt-12">
              <h3 className="font-display text-lg font-bold text-text-primary">
                Shortcuts &amp; Keys:
              </h3>
              <dl className="mt-4 divide-y divide-border-primary rounded-xl border border-border-primary bg-bg-secondary/50">
                {Object.entries(product.controls).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center sm:gap-6"
                  >
                    <dt className="text-sm font-medium text-text-primary">
                      {key}
                    </dt>
                    <dd className="text-sm text-text-secondary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-text-muted">
            {product.disclaimer}
          </p>

          <div className="mt-12 rounded-2xl border border-border-accent/30 bg-bg-card p-6">
            <h3 className="text-sm font-semibold text-text-primary">
              Share this product
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Copy the link and send it to your team.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                readOnly
                value={shareUrl}
                placeholder="Loading link…"
                className="min-w-0 flex-1 rounded-lg border border-border-primary bg-bg-tertiary px-3 py-2.5 text-sm text-text-secondary outline-none focus:border-border-accent"
              />
              <button
                type="button"
                onClick={copyShare}
                className="shrink-0 rounded-lg border border-border-accent bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
