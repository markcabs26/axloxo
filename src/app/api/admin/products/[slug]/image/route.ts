import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too big (max 5MB)" },
      { status: 400 }
    );
  }

  const sb = supabaseServer();
  const { data: product } = await sb
    .from("products")
    .select("id,image_path")
    .eq("slug", slug)
    .maybeSingle();
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${slug}/${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadErr } = await sb.storage
    .from("product-images")
    .upload(path, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  if (product.image_path && product.image_path !== path) {
    await sb.storage.from("product-images").remove([product.image_path]);
  }

  const { error: updErr } = await sb
    .from("products")
    .update({ image_path: path })
    .eq("id", product.id);
  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const url = `${base}/storage/v1/object/public/product-images/${path}`;
  return NextResponse.json({ ok: true, path, url });
}
