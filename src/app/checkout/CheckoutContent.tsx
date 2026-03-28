"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductBySlug } from "@/data/products";

function openPaddle(items: { priceId: string; quantity: number }[]) {
  if (!window.Paddle) {
    alert("Checkout is loading, please try again in a moment.");
    return;
  }
  window.Paddle.Checkout.open({
    items,
    settings: {
      displayMode: "overlay",
      theme: "dark",
    },
  });
}

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const { items: cartItems, clear } = useCart();
  const [qty, setQty] = useState(1);

  const productFromQuery = useMemo(
    () => (slug ? getProductBySlug(slug) : undefined),
    [slug]
  );

  const singlePaddleItems = useMemo(() => {
    if (!productFromQuery?.paddlePriceId) return null;
    return [{ priceId: productFromQuery.paddlePriceId, quantity: qty }];
  }, [productFromQuery, qty]);

  const cartPaddleItems = useMemo(
    () =>
      cartItems.map((l) => ({
        priceId: l.paddlePriceId,
        quantity: l.quantity,
      })),
    [cartItems]
  );

  const handlePaySingle = () => {
    if (!singlePaddleItems) return;
    openPaddle(singlePaddleItems);
  };

  const handlePayCart = () => {
    if (cartPaddleItems.length === 0) return;
    openPaddle(cartPaddleItems);
    clear();
  };

  if (slug && !productFromQuery) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Product not found
        </h1>
        <Link
          href="/catalog"
          className="mt-8 inline-block text-accent hover:text-accent-hover"
        >
          ← Back to catalog
        </Link>
      </div>
    );
  }

  if (slug && productFromQuery && !productFromQuery.paddlePriceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Checkout not available
        </h1>
        <p className="mt-2 text-text-secondary">
          This product isn&apos;t linked to Paddle yet.
        </p>
        <Link
          href={`/products/${productFromQuery.slug}`}
          className="mt-8 inline-block text-accent hover:text-accent-hover"
        >
          ← Back to product
        </Link>
      </div>
    );
  }

  if (productFromQuery?.paddlePriceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary">
          Complete your purchase
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          You&apos;re paying securely through Paddle. Review your plan below,
          then continue.
        </p>

        <div className="mt-8 rounded-2xl border border-border-primary bg-bg-card p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {productFromQuery.title}
          </h2>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {formatPrice(productFromQuery.price, productFromQuery.currency)}
            {productFromQuery.billingCycle && (
              <span className="text-base font-normal text-text-muted">
                {productFromQuery.billingCycle}
              </span>
            )}
          </p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Quantity
            </p>
            <div className="mt-2 inline-flex items-center rounded-xl border border-border-primary bg-bg-secondary">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-lg text-text-primary hover:bg-bg-tertiary"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="flex h-10 w-10 items-center justify-center text-lg text-text-primary hover:bg-bg-tertiary"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePaySingle}
            className="mt-8 w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-colors hover:bg-accent-hover"
          >
            Pay with Paddle
          </button>
          <Link
            href={`/products/${productFromQuery.slug}`}
            className="mt-4 block text-center text-sm text-text-muted hover:text-text-primary"
          >
            ← Back to product
          </Link>
        </div>
      </div>
    );
  }

  if (cartPaddleItems.length > 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary">
          Cart checkout
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {cartItems.length} line item(s). Paddle will open in a secure overlay.
        </p>

        <ul className="mt-8 space-y-4 rounded-2xl border border-border-primary bg-bg-card p-6">
          {cartItems.map((line) => (
            <li
              key={line.slug}
              className="flex justify-between gap-4 border-b border-border-primary pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-text-primary">{line.title}</p>
                <p className="text-sm text-text-muted">Qty {line.quantity}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-text-primary">
                {formatPrice(line.unitPrice * line.quantity, line.currency)}
              </p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handlePayCart}
          className="mt-8 w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-colors hover:bg-accent-hover"
        >
          Pay with Paddle
        </button>
        <Link
          href="/cart"
          className="mt-4 block text-center text-sm text-text-muted hover:text-text-primary"
        >
          ← Edit cart
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Nothing to checkout
      </h1>
      <p className="mt-3 text-text-secondary">
        Add something to your cart or open a product and choose{" "}
        <span className="text-text-primary">Buy now</span>.
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
