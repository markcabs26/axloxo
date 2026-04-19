"use client";

import { useState } from "react";
import Link from "next/link";
import { BraceletPreview } from "@/components/BraceletPreview";

export default function CustomPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.email?.trim() && !data.phone?.trim()) {
      setStatus("error");
      setError("Please give us either an email or a phone number.");
      return;
    }
    try {
      const res = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "sent") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex w-20 h-20 rounded-full bg-brand/10 items-center justify-center mb-6">
          <span className="text-4xl">💌</span>
        </div>
        <h1 className="font-display text-4xl font-semibold mb-4">
          Got it! Thanks for reaching out.
        </h1>
        <p className="text-muted text-lg mb-8 max-w-md mx-auto">
          We&apos;ll reply within a day or two with some ideas and a price
          quote. Custom bracelets usually ship within a week of approval.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 transition-colors"
        >
          Browse the shop meanwhile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
            Request a custom
          </h1>
          <p className="text-muted text-lg mb-6">
            Want specific colors, initials, or a charm? Fill this out and
            we&apos;ll design something just for you. We&apos;ll send a quick
            reply with a price (usually $12–$25 depending on materials) before
            we start.
          </p>
          <div className="rounded-2xl bg-cream p-6">
            <h3 className="font-display text-xl font-semibold mb-3">
              How it works
            </h3>
            <ol className="space-y-2 text-sm">
              <li><span className="font-semibold text-brand">1.</span> You fill out the form below.</li>
              <li><span className="font-semibold text-brand">2.</span> We reply with ideas + price.</li>
              <li><span className="font-semibold text-brand">3.</span> You approve and pay through a secure link.</li>
              <li><span className="font-semibold text-brand">4.</span> We make it and ship it out (usually within a week).</li>
            </ol>
          </div>
          <div className="mt-8 flex justify-center md:justify-start">
            <BraceletPreview
              colors={["#e85d75", "#4fc3f7", "#ffd180", "#a5d6a7", "#ab47bc"]}
              size={220}
              animate
            />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-accent/40 p-6 sm:p-8 space-y-4"
        >
          <Field label="Your name" name="name" required />
          <div>
            <p className="text-sm font-semibold mb-1.5">
              How should we reach you? <span className="text-brand">*</span>
            </p>
            <p className="text-xs text-muted mb-2">
              Email or phone — whichever you prefer (at least one).
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Email" name="email" type="email" hideLabel />
              <Field label="Phone" name="phone" type="tel" hideLabel placeholder="(555) 123-4567" />
            </div>
          </div>
          <Field
            label="Favorite colors"
            name="colors"
            placeholder="e.g. pink, gold, and a little bit of white"
            required
          />
          <Field
            label="Wrist size"
            name="size"
            placeholder="e.g. small / about 6 inches"
          />
          <Field
            label="For what occasion?"
            name="occasion"
            placeholder="birthday, just because, best-friend gift…"
          />
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Anything else?
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Initials, charms, style ideas, the person it's for…"
              className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-brand-dark">{error}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3.5 transition-colors"
          >
            {status === "sending" ? "Sending…" : "Send my request"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  hideLabel,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hideLabel?: boolean;
}) {
  return (
    <div>
      {!hideLabel && (
        <label className="block text-sm font-semibold mb-1.5">
          {label} {required && <span className="text-brand">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder ?? (hideLabel ? label : undefined)}
        aria-label={hideLabel ? label : undefined}
        required={required}
        className="w-full rounded-xl border border-accent bg-background px-4 py-2.5 focus:border-brand focus:outline-none"
      />
    </div>
  );
}
