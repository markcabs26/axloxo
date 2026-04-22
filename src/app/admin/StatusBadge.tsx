export const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  quoted: "Quoted",
  paid: "Paid",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "received"
      ? "bg-blue-100 text-blue-800"
      : status === "quoted"
        ? "bg-amber-100 text-amber-800"
        : status === "paid"
          ? "bg-emerald-100 text-emerald-800"
          : status === "shipped"
            ? "bg-violet-100 text-violet-800"
            : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
