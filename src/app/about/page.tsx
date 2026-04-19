import Link from "next/link";
import { BraceletPreview } from "@/components/BraceletPreview";

export const metadata = { title: "About — Axloxo" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex justify-center mb-8">
        <BraceletPreview
          colors={["#e85d75", "#f7c6b8", "#ffd180"]}
          size={180}
          animate
        />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-6 text-center">
        Hi, I&apos;m the bracelet maker.
      </h1>
      <div className="prose prose-lg text-muted space-y-5 text-lg leading-relaxed">
        <p>
          I started making bead bracelets because I liked playing with colors,
          and then my friends started asking if they could have one too.
          That&apos;s how Axloxo got started — from a kitchen table
          covered in beads (and a couple that rolled under the fridge).
        </p>
        <p>
          Every bracelet is strung, tied, and double-checked by me. My dad
          helps with shipping and the website part, because I&apos;m ten and
          that&apos;s not really my thing yet.
        </p>
        <p>
          If you want something specific — a color combo, a name, a charm for
          a friend&apos;s birthday — just{" "}
          <Link href="/custom" className="text-brand font-semibold underline">
            send me a request
          </Link>
          . I love designing customs the most.
        </p>
        <p className="font-display text-2xl text-foreground pt-4">
          Thanks for stopping by. ♡
        </p>
      </div>
    </div>
  );
}
