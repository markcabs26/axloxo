import { supabaseServer } from "./supabase";
import { products as staticProducts, type Product } from "@/data/products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  description: string;
  colors: string[];
  tags: string[];
  featured: boolean;
  sold_out: boolean;
  image_path: string | null;
  sort_order: number;
};

export type DbProduct = Product & {
  id: string;
  imageUrl?: string;
};

function imageUrlFor(path: string | null): string | undefined {
  if (!path) return undefined;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return undefined;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

function rowToProduct(r: ProductRow): DbProduct {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    priceCents: r.price_cents,
    description: r.description,
    colors: r.colors,
    tags: r.tags,
    featured: r.featured,
    soldOut: r.sold_out,
    imageUrl: imageUrlFor(r.image_path),
  };
}

function fallback(): DbProduct[] {
  return staticProducts.map((p, i) => ({ ...p, id: `static-${i}` }));
}

export async function listProducts(): Promise<DbProduct[]> {
  try {
    const { data, error } = await supabaseServer()
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    if (!data?.length) return fallback();
    return data.map(rowToProduct);
  } catch (e) {
    console.error("[products] DB read failed, falling back to static:", e);
    return fallback();
  }
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  try {
    const { data, error } = await supabaseServer()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToProduct(data);
  } catch (e) {
    console.error("[products] DB read failed for", slug, e);
    const fb = fallback().find((p) => p.slug === slug);
    return fb ?? null;
  }
}

export async function listProductSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabaseServer()
      .from("products")
      .select("slug");
    if (error) throw error;
    return (data ?? []).map((r) => r.slug);
  } catch {
    return staticProducts.map((p) => p.slug);
  }
}
