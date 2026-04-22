import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import { StatusBadge, STATUS_LABELS } from "./StatusBadge";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  colors: string;
};

export default async function AdminDashboard() {
  const sb = supabaseServer();
  const { data: recent } = await sb
    .from("requests")
    .select("id,name,status,created_at,colors")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: all } = await sb.from("requests").select("status");
  const statusCounts: Record<string, number> = {};
  for (const r of all ?? []) {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["received", "quoted", "paid", "shipped", "cancelled"] as const).map(
          (s) => (
            <Link
              key={s}
              href={`/manage/requests?status=${s}`}
              className="bg-white border border-accent/40 rounded-2xl p-4 hover:border-brand transition-colors"
            >
              <p className="text-xs uppercase tracking-wide text-muted">
                {STATUS_LABELS[s]}
              </p>
              <p className="font-display text-3xl font-semibold mt-1">
                {statusCounts[s] ?? 0}
              </p>
            </Link>
          )
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Recent requests</h2>
          <Link
            href="/manage/requests"
            className="text-sm text-brand hover:underline"
          >
            View all →
          </Link>
        </div>
        <RequestList rows={(recent ?? []) as RequestRow[]} />
      </div>
    </div>
  );
}

function RequestList({ rows }: { rows: RequestRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-muted text-sm bg-white rounded-2xl p-6 border border-accent/40">
        No requests yet.
      </p>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-accent/40 divide-y divide-accent/40">
      {rows.map((r) => (
        <Link
          key={r.id}
          href={`/manage/requests/${r.id}`}
          className="block px-4 py-3 hover:bg-cream/60 transition-colors"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{r.name}</p>
              <p className="text-sm text-muted truncate">{r.colors}</p>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={r.status} />
              <p className="text-xs text-muted mt-1">
                {new Date(r.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
