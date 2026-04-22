import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  colors: string[];
  sold_out: boolean;
  featured: boolean;
  image_path: string | null;
};

export default async function AdminProducts() {
  const { data } = await supabaseServer()
    .from("products")
    .select("id,slug,name,price_cents,colors,sold_out,featured,image_path")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-4 py-2 text-sm"
        >
          + New product
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data as Row[] | null)?.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.slug}`}
            className="bg-white border border-accent/40 rounded-2xl p-4 hover:border-brand transition-colors"
          >
            <div className="aspect-square bg-gradient-to-br from-cream to-accent/30 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
              <ProductImage
                imageUrl={
                  p.image_path && base
                    ? `${base}/storage/v1/object/public/product-images/${p.image_path}`
                    : undefined
                }
                colors={p.colors}
                size={160}
                alt={p.name}
              />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display font-semibold truncate">{p.name}</p>
              <p className="text-sm text-brand whitespace-nowrap">
                ${(p.price_cents / 100).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2 mt-2 text-xs">
              {p.sold_out && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  Sold out
                </span>
              )}
              {p.featured && (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
