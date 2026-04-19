import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/data/products";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  const body = (await req.json()) as {
    items: Array<{ slug: string; quantity: number }>;
  };

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  type Params = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>;
  type LineItem = NonNullable<Params["line_items"]>[number];
  const line_items: LineItem[] = [];
  for (const { slug, quantity } of body.items) {
    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${slug}` },
        { status: 400 }
      );
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: `Bad quantity for ${slug}` },
        { status: 400 }
      );
    }
    line_items.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.priceCents,
        product_data: {
          name: product.name,
          description: product.description.slice(0, 250),
          metadata: { slug: product.slug },
        },
      },
    });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 500, currency: "usd" },
          display_name: "US Standard (3–5 business days)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    phone_number_collection: { enabled: true },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
