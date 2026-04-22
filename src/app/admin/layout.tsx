import Link from "next/link";
import { AdminLogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-accent/40 bg-white sticky top-[65px] z-30">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-4 overflow-x-auto">
          <nav className="flex items-center gap-1 text-sm whitespace-nowrap">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/requests"
              className="px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
            >
              Requests
            </Link>
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
            >
              Products
            </Link>
          </nav>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
