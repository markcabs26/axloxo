import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const STATUSES = ["received", "quoted", "paid", "shipped", "cancelled"];

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = (await req.json()) as {
    status?: string;
    quoted_cents?: number | null;
    payment_link?: string | null;
    admin_notes?: string | null;
  };

  const update: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Bad status" }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.quoted_cents !== undefined) update.quoted_cents = body.quoted_cents;
  if (body.payment_link !== undefined) update.payment_link = body.payment_link;
  if (body.admin_notes !== undefined) update.admin_notes = body.admin_notes;

  const { error } = await supabaseServer()
    .from("requests")
    .update(update)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { error } = await supabaseServer()
    .from("requests")
    .delete()
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
