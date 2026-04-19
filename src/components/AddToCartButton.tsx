"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

type Props = {
  slug: string;
  name: string;
  priceCents: number;
  soldOut?: boolean;
};

export function AddToCartButton({ slug, name, priceCents, soldOut }: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (soldOut) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="w-full sm:w-auto rounded-full bg-muted/40 text-muted font-semibold px-8 py-3.5 cursor-not-allowed"
        >
          Sold out
        </button>
        <p className="text-sm text-muted">
          This design isn&apos;t in stock right now — but Allie can make one{" "}
          <Link href="/custom" className="text-brand font-semibold underline">
            as a custom order
          </Link>
          .
        </p>
      </div>
    );
  }

  const onClick = () => {
    add({ slug, name, priceCents });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <button
      onClick={onClick}
      className="w-full sm:w-auto rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 transition-colors"
    >
      {justAdded ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
