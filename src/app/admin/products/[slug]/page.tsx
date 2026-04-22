import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: p } = await supabaseServer()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!p) notFound();

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl =
    p.image_path && base
      ? `${base}/storage/v1/object/public/product-images/${p.image_path}`
      : undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="text-sm text-muted hover:text-brand"
      >
        ← All products
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{p.name}</h1>
        <Link
          href={`/shop/${p.slug}`}
          target="_blank"
          className="text-sm text-brand hover:underline"
        >
          View public page ↗
        </Link>
      </div>
      <ProductForm
        mode="edit"
        originalSlug={p.slug}
        initial={{
          id: p.id,
          slug: p.slug,
          name: p.name,
          priceDollars: (p.price_cents / 100).toFixed(2),
          description: p.description ?? "",
          colors: (p.colors ?? []).join(", "),
          tags: (p.tags ?? []).join(", "),
          featured: p.featured,
          soldOut: p.sold_out,
          sortOrder: String(p.sort_order ?? 100),
          imageUrl,
        }}
      />
    </div>
  );
}
