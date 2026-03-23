import Link from "next/link";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-bg-card border border-border-primary hover:border-border-accent transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]">
        <div className="aspect-[4/3] bg-bg-tertiary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-accent"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                {product.shortTitle}
              </p>
            </div>
          </div>

          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sale text-white rounded-md">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-accent transition-colors duration-200">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            {product.hasVariants && (
              <span className="text-xs text-text-muted">From </span>
            )}
            <span className="text-sm font-bold text-text-primary">
              {formatPrice(product.price, product.currency)}
              {product.billingCycle && (
                <span className="text-xs font-normal text-text-muted">
                  {product.billingCycle}
                </span>
              )}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
