import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import { RequestEditor } from "./RequestEditor";

export const dynamic = "force-dynamic";

export default async function RequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: request, error } = await supabaseServer()
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !request) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/requests" className="text-sm text-muted hover:text-brand">
        ← All requests
      </Link>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{request.name}</h1>
        <p className="text-sm text-muted">
          Received{" "}
          {new Date(request.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-accent/40 p-6 space-y-3">
          <h2 className="font-display text-xl font-semibold">Details</h2>
          <Detail label="Email" value={request.email || "—"} />
          <Detail label="Phone" value={request.phone || "—"} />
          <Detail label="Colors" value={request.colors} />
          <Detail label="Size" value={request.size || "—"} />
          <Detail label="Occasion" value={request.occasion || "—"} />
          <Detail label="Notes" value={request.notes || "—"} multiline />
        </section>

        <RequestEditor
          id={request.id}
          initialStatus={request.status}
          initialQuotedCents={request.quoted_cents}
          initialPaymentLink={request.payment_link}
          initialAdminNotes={request.admin_notes}
        />
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p
        className={multiline ? "whitespace-pre-wrap" : ""}
        style={multiline ? undefined : { wordBreak: "break-word" }}
      >
        {value}
      </p>
    </div>
  );
}
