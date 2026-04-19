import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { BraceletPreview } from "@/components/BraceletPreview";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-brand font-semibold tracking-wide uppercase text-sm mb-4">
              Handmade · One at a time
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
              Little bracelets,<br />
              <span className="text-brand">big personality.</span>
            </h1>
            <p className="text-lg text-muted max-w-md mb-8">
              Every bracelet is strung by hand in our kitchen — picked bead by bead, knotted, and ready to make a wrist happy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-foreground text-background font-semibold px-7 py-3.5 hover:bg-brand transition-colors"
              >
                Shop the collection
              </Link>
              <Link
                href="/custom"
                className="inline-flex rounded-full border-2 border-foreground text-foreground font-semibold px-7 py-3.5 hover:bg-foreground hover:text-background transition-colors"
              >
                Request a custom
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl" />
            <BraceletPreview
              colors={["#e85d75", "#f7c6b8", "#4fc3f7", "#ffd180", "#a5d6a7"]}
              size={380}
              animate
              className="relative"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            This week&apos;s favorites
          </h2>
          <Link href="/shop" className="text-brand font-semibold hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            Want something one-of-a-kind?
          </h2>
          <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
            Tell us the colors, the vibe, or the initials you want. We&apos;ll design a bracelet just for you (or your friend, or your grandma — we don&apos;t judge).
          </p>
          <Link
            href="/custom"
            className="inline-flex rounded-full bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 transition-colors"
          >
            Start a custom order
          </Link>
        </div>
      </section>
    </>
  );
}
