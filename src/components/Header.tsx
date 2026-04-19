"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-accent/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-5 text-sm sm:text-base">
          <Link href="/shop" className="px-2 py-1 hover:text-brand transition-colors">
            Shop
          </Link>
          <Link href="/custom" className="px-2 py-1 hover:text-brand transition-colors">
            Custom
          </Link>
          <Link href="/about" className="px-2 py-1 hover:text-brand transition-colors hidden sm:inline">
            About
          </Link>
          <Link
            href="/cart"
            className="relative ml-1 sm:ml-2 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 sm:px-4 py-2 text-sm hover:bg-brand transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2l1.5 4.5m0 0L9 14h10l2-8H7.5zm0 0H3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
            <span>Cart</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
