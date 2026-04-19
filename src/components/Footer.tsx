import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-accent/50 bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Logo />
          <p className="text-sm text-muted mt-2 max-w-sm">
            Handmade bead bracelets, made with a lot of care (and a little bit of bead-spilling) in our kitchen.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/shop" className="hover:text-brand">Shop</Link>
          <Link href="/custom" className="hover:text-brand">Custom orders</Link>
          <Link href="/about" className="hover:text-brand">About</Link>
          <Link href="/cart" className="hover:text-brand">Cart</Link>
        </div>
      </div>
      <div className="border-t border-accent/50">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-muted flex flex-col sm:flex-row justify-between gap-1">
          <span>© {new Date().getFullYear()} Axloxo</span>
          <span>Flat $5 shipping within the US. Made with love.</span>
        </div>
      </div>
    </footer>
  );
}
