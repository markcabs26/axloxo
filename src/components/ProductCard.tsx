import Link from "next/link";
import { Product, formatPrice } from "@/data/products";
import { BraceletPreview } from "./BraceletPreview";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block rounded-3xl bg-white border border-accent/40 p-5 hover:border-brand hover:shadow-lg transition-all"
    >
      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-cream to-accent/30 rounded-2xl mb-4 group-hover:from-accent/20 group-hover:to-accent/50 transition-colors">
        <BraceletPreview colors={product.colors} size={180} />
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold leading-tight">
          {product.name}
        </h3>
        <span className="font-semibold text-brand whitespace-nowrap">
          {formatPrice(product.priceCents)}
        </span>
      </div>
      <div className="flex gap-1 mt-2">
        {product.tags.map((t) => (
          <span
            key={t}
            className="text-xs text-muted bg-cream px-2 py-0.5 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
