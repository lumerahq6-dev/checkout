import { notFound, redirect } from "next/navigation";
import { getProductByBuyPath, products } from "@/data/products";

/**
 * Entry URLs for ads / partner sites: `/buy/{buyPath}` (e.g. `/buy/ultimate`).
 *
 * This route responds with an HTTP redirect to `/checkout` (no client-side hop).
 * That way the **next** document request to `/checkout` typically sends
 * `Referer: <this site>/buy/...` instead of the original third-party site—so
 * payment surfaces see a first-party handoff on your domain.
 */
export function generateStaticParams() {
  return products.map((p) => ({ code: p.buyPath }));
}

function parseQty(raw: string | undefined): number {
  const n = parseInt(raw || "1", 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(99, Math.max(1, n));
}

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ qty?: string }>;
};

export default async function BuyPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { qty: qtyRaw } = await searchParams;

  const product = getProductByBuyPath(code);
  if (!product) notFound();

  if (!product.paddlePriceId) {
    redirect(`/products/${product.slug}`);
  }

  const qty = parseQty(qtyRaw);
  const q = new URLSearchParams();
  q.set("slug", product.slug);
  q.set("auto", "1");
  q.set("qty", String(qty));
  redirect(`/checkout?${q.toString()}`);
}
