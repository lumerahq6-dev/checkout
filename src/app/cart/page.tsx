"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPage() {
  const { items, itemCount, setQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Your cart is empty
        </h1>
        <p className="mt-3 text-text-secondary">
          Add products from the catalog to continue.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Cart
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-text-primary">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => clear()}
          className="text-sm text-text-muted hover:text-text-primary"
        >
          Clear cart
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {items.map((line) => (
          <li
            key={line.slug}
            className="flex flex-col gap-4 rounded-2xl border border-border-primary bg-bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${line.slug}`}
                className="font-semibold text-text-primary hover:text-accent"
              >
                {line.title}
              </Link>
              <p className="mt-1 text-sm text-text-muted">
                {formatPrice(line.unitPrice, line.currency)} each
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center rounded-xl border border-border-primary bg-bg-secondary">
                <button
                  type="button"
                  onClick={() => setQty(line.slug, line.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center text-text-primary hover:bg-bg-tertiary"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(line.slug, line.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center text-text-primary hover:bg-bg-tertiary"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(line.slug)}
                className="text-sm text-sale hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/checkout"
          className="flex-1 rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-colors hover:bg-accent-hover"
        >
          Proceed to checkout
        </Link>
        <Link
          href="/catalog"
          className="flex-1 rounded-xl border border-border-primary py-3.5 text-center text-sm font-semibold text-text-primary hover:bg-bg-card"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
