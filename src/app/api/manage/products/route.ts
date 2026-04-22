import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>;
  const required = ["slug", "name", "price_cents"];
  for (const k of required) {
    if (body[k] === undefined || body[k] === "") {
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
    }
  }
  const { error } = await supabaseServer().from("products").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
