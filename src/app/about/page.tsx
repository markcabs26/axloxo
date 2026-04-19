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
        Hi, I&apos;m Allie.
      </h1>
      <div className="prose prose-lg text-muted space-y-5 text-lg leading-relaxed">
        <p>
          I&apos;m Allie Cablayn and I have just started my very own bracelet
          company. It&apos;s called Axloxo, and every bracelet you see here is
          made by me — one bead at a time, at our kitchen table (which is
          almost always covered in beads).
        </p>
        <p>
          I started making bracelets because I love picking out color
          combinations, and then my friends kept asking where I got them.
          When I told them I made them myself, they wanted their own — so I
          figured I&apos;d make it official.
        </p>
        <p>
          Every bracelet is strung, tied, and double-checked by me. My dad
          helps with shipping and built the website, because I&apos;m ten and
          that part isn&apos;t really my thing yet.
        </p>
        <p>
          If you want something specific — a color combo, a name, a charm for
          a friend&apos;s birthday — just{" "}
          <Link href="/custom" className="text-brand font-semibold underline">
            send me a request
          </Link>
          . Customs are my favorite part.
        </p>
        <p className="font-display text-2xl text-foreground pt-4">
          Thanks for stopping by. ♡<br />
          <span className="text-base text-muted font-sans">— Allie</span>
        </p>
      </div>
    </div>
  );
}
