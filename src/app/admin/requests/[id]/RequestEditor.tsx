"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS } from "../../StatusBadge";

const STATUSES = ["received", "quoted", "paid", "shipped", "cancelled"] as const;

type Props = {
  id: string;
  initialStatus: string;
  initialQuotedCents: number | null;
  initialPaymentLink: string | null;
  initialAdminNotes: string | null;
};

export function RequestEditor({
  id,
  initialStatus,
  initialQuotedCents,
  initialPaymentLink,
  initialAdminNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [quotedDollars, setQuotedDollars] = useState(
    initialQuotedCents != null ? (initialQuotedCents / 100).toFixed(2) : ""
  );
  const [paymentLink, setPaymentLink] = useState(initialPaymentLink ?? "");
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const cents = quotedDollars ? Math.round(Number(quotedDollars) * 100) : null;
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          quoted_cents: cents,
          payment_link: paymentLink || null,
          admin_notes: adminNotes || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setMsg("Saved");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this request? This can't be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/requests");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-accent/40 p-6 space-y-4">
      <h2 className="font-display text-xl font-semibold">Manage</h2>

      <div>
        <label className="block text-sm font-semibold mb-1.5">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                status === s
                  ? "bg-foreground text-background border-foreground"
                  : "border-accent/60 hover:border-brand"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">Quote ($)</label>
        <input
          value={quotedDollars}
          onChange={(e) => setQuotedDollars(e.target.value)}
          inputMode="decimal"
          placeholder="e.g. 15.00"
          className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">
          Stripe payment link
        </label>
        <input
          value={paymentLink}
          onChange={(e) => setPaymentLink(e.target.value)}
          type="url"
          placeholder="https://buy.stripe.com/…"
          className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">
          Private notes
        </label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>

      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      {err && <p className="text-sm text-brand-dark">{err}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 rounded-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-2.5 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onDelete}
          disabled={saving}
          className="text-sm text-muted hover:text-brand-dark px-3"
        >
          Delete
        </button>
      </div>
    </section>
  );
}
