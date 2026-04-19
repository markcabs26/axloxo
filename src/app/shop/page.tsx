import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Shop — Axloxo" };

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">
          The whole collection
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          {products.length} bracelets, ready to ship. Don&apos;t see the exact colors you want? We also make{" "}
          <a href="/custom" className="text-brand font-semibold underline">
            customs
          </a>
          .
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
