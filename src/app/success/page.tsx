import Link from "next/link";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = { title: "Thanks for your order — Axloxo" };

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <ClearCartOnMount />
      <div className="inline-flex w-20 h-20 rounded-full bg-brand/10 items-center justify-center mb-6">
        <span className="text-4xl">🎉</span>
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
        Thank you!
      </h1>
      <p className="text-lg text-muted mb-8 max-w-md mx-auto">
        Your bracelet is on the way to being made. We&apos;ll send a confirmation email with your order details, and again when it ships.
      </p>
      <Link
        href="/shop"
        className="inline-flex rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 transition-colors"
      >
        Keep shopping
      </Link>
    </div>
  );
}
