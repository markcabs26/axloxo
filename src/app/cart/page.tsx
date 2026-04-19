"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { BraceletPreview } from "@/components/BraceletPreview";
import { getProduct } from "@/data/products";

const SHIPPING_CENTS = 500;

export default function CartPage() {
  const { items, setQuantity, remove, subtotalCents } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalCents = items.length ? subtotalCents + SHIPPING_CENTS : 0;

  const onCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold mb-4">
          Your cart is empty
        </h1>
        <p className="text-muted mb-8">
          Go pick out something pretty.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 transition-colors"
        >
          Shop bracelets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-8">
        Your cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = getProduct(item.slug);
            return (
              <div
                key={item.slug}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-accent/40"
              >
                <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-cream to-accent/40 rounded-xl flex items-center justify-center">
                  {product && (
                    <BraceletPreview colors={product.colors} size={80} />
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-display font-semibold text-lg hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <span className="font-semibold text-brand whitespace-nowrap">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {formatPrice(item.priceCents)} each
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-accent rounded-full">
                      <button
                        onClick={() =>
                          setQuantity(item.slug, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:text-brand"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(item.slug, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:text-brand"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.slug)}
                      className="text-sm text-muted hover:text-brand"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-cream rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-display text-xl font-semibold mb-4">
            Order summary
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping (US flat)</span>
              <span>{formatPrice(SHIPPING_CENTS)}</span>
            </div>
          </div>
          <div className="border-t border-accent pt-4 flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          {checkoutError && (
            <p className="text-sm text-brand-dark mb-3">{checkoutError}</p>
          )}
          <button
            onClick={onCheckout}
            disabled={checkoutLoading}
            className="w-full rounded-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3.5 transition-colors"
          >
            {checkoutLoading ? "Redirecting…" : "Checkout"}
          </button>
          <p className="text-xs text-muted mt-3 text-center">
            Secure checkout powered by Stripe
          </p>
        </aside>
      </div>
    </div>
  );
}
