import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import { StatusBadge, STATUS_LABELS } from "../StatusBadge";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

const STATUSES = ["received", "quoted", "paid", "shipped", "cancelled"] as const;

export default async function RequestsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const sb = supabaseServer();

  let q = sb
    .from("requests")
    .select("id,name,status,created_at,colors,email,phone")
    .order("created_at", { ascending: false });
  if (status && STATUSES.includes(status as typeof STATUSES[number])) {
    q = q.eq("status", status);
  }
  const { data } = await q;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Requests</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink current={status} value="">
          All
        </FilterLink>
        {STATUSES.map((s) => (
          <FilterLink key={s} current={status} value={s}>
            {STATUS_LABELS[s]}
          </FilterLink>
        ))}
      </div>

      {data && data.length > 0 ? (
        <div className="bg-white rounded-2xl border border-accent/40 divide-y divide-accent/40">
          {data.map((r) => (
            <Link
              key={r.id}
              href={`/admin/requests/${r.id}`}
              className="block px-4 py-3 hover:bg-cream/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="text-sm text-muted truncate">
                    {r.email || r.phone || "(no contact)"} · {r.colors}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={r.status} />
                  <p className="text-xs text-muted mt-1">
                    {new Date(r.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted bg-white rounded-2xl p-6 border border-accent/40">
          No requests matching that filter.
        </p>
      )}
    </div>
  );
}

function FilterLink({
  value,
  current,
  children,
}: {
  value: string;
  current: string | undefined;
  children: React.ReactNode;
}) {
  const active = (current ?? "") === value;
  return (
    <Link
      href={value ? `/admin/requests?status=${value}` : "/admin/requests"}
      className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-accent/60 hover:border-brand"
      }`}
    >
      {children}
    </Link>
  );
}
