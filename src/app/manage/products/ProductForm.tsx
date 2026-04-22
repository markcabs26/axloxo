"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";

export type ProductFormInitial = {
  id?: string;
  slug?: string;
  name?: string;
  priceDollars?: string;
  description?: string;
  colors?: string;
  tags?: string;
  featured?: boolean;
  soldOut?: boolean;
  sortOrder?: string;
  imageUrl?: string;
};

type Props = {
  mode: "new" | "edit";
  initial: ProductFormInitial;
  originalSlug?: string;
};

export function ProductForm({ mode, initial, originalSlug }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: initial.slug ?? "",
    name: initial.name ?? "",
    priceDollars: initial.priceDollars ?? "",
    description: initial.description ?? "",
    colors: initial.colors ?? "",
    tags: initial.tags ?? "",
    featured: initial.featured ?? false,
    soldOut: initial.soldOut ?? true,
    sortOrder: initial.sortOrder ?? "100",
  });
  const [imageUrl, setImageUrl] = useState<string | undefined>(initial.imageUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        price_cents: Math.round(Number(form.priceDollars) * 100),
        description: form.description,
        colors: form.colors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        featured: form.featured,
        sold_out: form.soldOut,
        sort_order: Number(form.sortOrder) || 100,
      };
      const url =
        mode === "new"
          ? "/api/manage/products"
          : `/api/manage/products/${originalSlug}`;
      const res = await fetch(url, {
        method: mode === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      if (mode === "new") {
        router.push(`/manage/products/${payload.slug}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mode === "new") {
      setErr("Save the product first, then upload an image.");
      return;
    }
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `/api/manage/products/${originalSlug}/image`,
        { method: "POST", body: fd }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setImageUrl(`${json.url}?t=${Date.now()}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/manage/products/${originalSlug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/manage/products");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
      setSaving(false);
    }
  };

  const colorsArr = form.colors
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-accent/40 p-6 space-y-4">
        <Field
          label="Slug (URL)"
          value={form.slug}
          onChange={(v) => update("slug", v)}
          required
          disabled={mode === "edit"}
          hint="Used in the URL, e.g. sunset-stripe. Can't change after creating."
        />
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => update("name", v)}
          required
        />
        <Field
          label="Price ($)"
          value={form.priceDollars}
          onChange={(v) => update("priceDollars", v)}
          type="text"
          inputMode="decimal"
          required
        />
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
          />
        </div>
        <Field
          label="Colors (comma-separated hex)"
          value={form.colors}
          onChange={(v) => update("colors", v)}
          placeholder="#ff8a65, #ffd180, #f4a261"
          hint="Used for the SVG preview when no photo is set."
        />
        <Field
          label="Tags (comma-separated)"
          value={form.tags}
          onChange={(v) => update("tags", v)}
          placeholder="charm, warm-tones"
        />
        <Field
          label="Sort order"
          value={form.sortOrder}
          onChange={(v) => update("sortOrder", v)}
          type="number"
          hint="Lower numbers show first."
        />
        <div className="flex flex-wrap gap-4">
          <Toggle
            label="Featured (home page)"
            value={form.featured}
            onChange={(v) => update("featured", v)}
          />
          <Toggle
            label="Sold out"
            value={form.soldOut}
            onChange={(v) => update("soldOut", v)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-accent/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Photo</h3>
          <div className="aspect-square bg-gradient-to-br from-cream to-accent/30 rounded-xl overflow-hidden flex items-center justify-center">
            <ProductImage
              imageUrl={imageUrl}
              colors={colorsArr.length ? colorsArr : ["#e85d75", "#f7c6b8"]}
              size={260}
              alt={form.name || "Preview"}
            />
          </div>
          <label className="block">
            <span className="sr-only">Upload photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={mode === "new" || uploading}
              className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand file:text-white file:font-semibold file:px-4 file:py-2 file:hover:bg-brand-dark disabled:opacity-50"
            />
          </label>
          {mode === "new" && (
            <p className="text-xs text-muted">
              Save the product first, then upload a photo.
            </p>
          )}
          {uploading && <p className="text-xs text-muted">Uploading…</p>}
        </div>

        {err && (
          <p className="bg-red-50 text-red-800 text-sm px-4 py-3 rounded-xl">
            {err}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 transition-colors"
          >
            {saving ? "Saving…" : mode === "new" ? "Create product" : "Save"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="text-sm text-muted hover:text-brand-dark px-3"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  required,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none disabled:opacity-60"
      />
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-brand"
      />
      {label}
    </label>
  );
}
