import Link from "next/link";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/manage/products"
        className="text-sm text-muted hover:text-brand"
      >
        ← All products
      </Link>
      <h1 className="font-display text-3xl font-semibold">New product</h1>
      <ProductForm mode="new" initial={{}} />
    </div>
  );
}
