import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProduct, formatPrice } from "@/data/products";
import { BraceletPreview } from "@/components/BraceletPreview";
import { AddToCartButton } from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product
      ? `${product.name} — Axloxo`
      : "Not found — Axloxo",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link href="/shop" className="text-sm text-muted hover:text-brand">
        ← Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-cream to-accent/40 rounded-3xl">
          <BraceletPreview colors={product.colors} size={340} animate />
        </div>
        <div className="flex flex-col">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-brand mb-6">
            {formatPrice(product.priceCents)}
          </p>
          <p className="text-muted text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map((t) => (
              <span
                key={t}
                className="text-sm text-foreground bg-accent/30 px-3 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
          <AddToCartButton
            slug={product.slug}
            name={product.name}
            priceCents={product.priceCents}
            soldOut={product.soldOut}
          />
          {!product.soldOut && (
            <p className="text-xs text-muted mt-4">
              Flat $5 shipping within the US · Usually ships in 2–3 days
            </p>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-2xl font-semibold mb-6">
          You might also like
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="group rounded-2xl bg-white border border-accent/40 p-4 hover:border-brand transition-all"
            >
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-cream to-accent/30 rounded-xl mb-3">
                <BraceletPreview colors={p.colors} size={140} />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-display font-semibold">{p.name}</span>
                <span className="text-brand text-sm">
                  {formatPrice(p.priceCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
