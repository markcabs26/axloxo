export type Product = {
  slug: string;
  name: string;
  priceCents: number;
  description: string;
  colors: string[];
  tags: string[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "sunset-stripe",
    name: "Sunset Stripe",
    priceCents: 1200,
    description:
      "Warm coral, peach, and gold glass beads — like a sky right before the sun dips down. Stretchy cord fits wrists 5½\"–7\".",
    colors: ["#ff8a65", "#ffd180", "#f4a261"],
    tags: ["everyday", "warm-tones"],
    featured: true,
  },
  {
    slug: "ocean-drops",
    name: "Ocean Drops",
    priceCents: 1400,
    description:
      "Translucent sea-blue beads with a tiny silver starfish charm. A little splash of summer on your wrist.",
    colors: ["#4fc3f7", "#81d4fa", "#b3e5fc"],
    tags: ["charm", "cool-tones"],
    featured: true,
  },
  {
    slug: "berry-party",
    name: "Berry Party",
    priceCents: 1200,
    description:
      "Raspberry, blueberry, and blackberry beads in a mix-and-match pattern. Fun, punchy, and very fruity.",
    colors: ["#e91e63", "#7e57c2", "#5e35b1"],
    tags: ["everyday", "bold"],
    featured: true,
  },
  {
    slug: "mint-cream",
    name: "Mint & Cream",
    priceCents: 1300,
    description:
      "Soft mint green paired with creamy pearl beads and a single gold letter bead (we'll pick one at random — surprise!).",
    colors: ["#a5d6a7", "#fff8e1", "#e8f5e9"],
    tags: ["pastel", "letter-bead"],
  },
  {
    slug: "midnight-sparkle",
    name: "Midnight Sparkle",
    priceCents: 1500,
    description:
      "Deep navy beads, tiny silver seed beads, and a crystal star. Looks especially great on date nights and school dances.",
    colors: ["#1a237e", "#b0bec5", "#eceff1"],
    tags: ["charm", "evening"],
    featured: true,
  },
  {
    slug: "bff-duo",
    name: "BFF Duo (set of 2)",
    priceCents: 2000,
    description:
      "Two matching bracelets — one for you, one for your best friend. Pink and lavender with heart charms. Ships as a pair.",
    colors: ["#f8bbd0", "#d1c4e9", "#fce4ec"],
    tags: ["set", "friendship"],
  },
  {
    slug: "rainbow-stack",
    name: "Rainbow Stack (set of 3)",
    priceCents: 2500,
    description:
      "Three stretchy bracelets in red/orange/yellow, green/blue, and purple/pink. Wear one, wear them all.",
    colors: ["#ef5350", "#42a5f5", "#ab47bc"],
    tags: ["set", "bold"],
  },
  {
    slug: "forest-walk",
    name: "Forest Walk",
    priceCents: 1300,
    description:
      "Earthy wood beads, moss-green glass, and a tiny leaf charm. For anyone who likes being outside.",
    colors: ["#8d6e63", "#689f38", "#a1887f"],
    tags: ["charm", "earth-tones"],
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const formatPrice = (cents: number) =>
  `$${(cents / 100).toFixed(2)}`;
