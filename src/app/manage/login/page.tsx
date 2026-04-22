"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/manage";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/manage/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-3xl border border-accent/40 p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <p className="text-muted text-sm">
          Log in to manage orders, products, and photos.
        </p>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-brand-dark">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 transition-colors"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
