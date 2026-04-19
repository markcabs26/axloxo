"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  slug: string;
  name: string;
  priceCents: number;
};

export function AddToCartButton({ slug, name, priceCents }: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

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
