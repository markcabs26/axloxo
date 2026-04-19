import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Shop — Axloxo" };

export default function ShopPage() {
  const allSoldOut = products.every((p) => p.soldOut);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">
          The whole collection
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          These are the designs Allie has made so far. Browse for inspiration
          — then{" "}
          <Link href="/custom" className="text-brand font-semibold underline">
            request a custom
          </Link>{" "}
          in your favorite colors.
        </p>
      </div>

      {allSoldOut && (
        <div className="mb-8 rounded-2xl bg-cream border border-accent/50 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-display text-lg font-semibold">
              The ready-made collection is sold out right now.
            </p>
            <p className="text-muted text-sm mt-1">
              Allie is still taking custom orders — pick your colors and
              she&apos;ll make one just for you.
            </p>
          </div>
          <Link
            href="/custom"
            className="shrink-0 inline-flex rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 transition-colors"
          >
            Request a custom
          </Link>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
