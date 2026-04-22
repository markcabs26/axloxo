import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const body = (await req.json()) as Record<string, unknown>;
  // Don't let the caller change the slug here (URL identity).
  delete body.slug;
  const { error } = await supabaseServer()
    .from("products")
    .update(body)
    .eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const sb = supabaseServer();
  const { data: existing } = await sb
    .from("products")
    .select("image_path")
    .eq("slug", slug)
    .maybeSingle();
  if (existing?.image_path) {
    await sb.storage.from("product-images").remove([existing.image_path]);
  }
  const { error } = await sb.from("products").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
