# Axloxo

Handmade bead bracelet shop at [axloxo.com](https://axloxo.com). Built with Next.js + Tailwind + Stripe Checkout.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in at least STRIPE_SECRET_KEY
npm run dev
```

Open http://localhost:3000.

## Where things live

- `src/data/products.ts` — the catalog. Add/edit bracelets here (name, price, colors, description).
- `src/app/page.tsx` — home page hero + featured items.
- `src/app/shop/` — shop index + dynamic product pages (`[slug]`).
- `src/app/cart/page.tsx` — cart (state lives in `localStorage` via `src/lib/cart.tsx`).
- `src/app/custom/page.tsx` — custom request form.
- `src/app/api/checkout/route.ts` — creates a Stripe Checkout session with $5 US flat shipping.
- `src/app/api/custom-request/route.ts` — receives the custom form; logs + emails (via Resend) if configured.
- `src/components/BraceletPreview.tsx` — the generated SVG bracelet visual. Later you can swap in real photos by editing `ProductCard.tsx` and the product page.

## Adding a new bracelet

Open `src/data/products.ts` and add an entry. The slug becomes the URL at `/shop/<slug>`. `featured: true` makes it show on the home page.

## Replacing the SVG preview with real photos

When you have photos, add an `image: '/products/sunset-stripe.jpg'` field to each product, drop the files in `public/products/`, and swap the `<BraceletPreview>` calls in `ProductCard.tsx` and `src/app/shop/[slug]/page.tsx` for `<Image>` tags.

## Environment variables

See `.env.example`. To actually take payments you need real Stripe keys — start with test keys (`sk_test_...`) and use [Stripe's test cards](https://stripe.com/docs/testing#cards) to try checkout end-to-end.

## Deploying to DigitalOcean App Platform

This project ships with an App Platform spec at `.do/app.yaml`. You can either point the DO UI at this repo and let it auto-detect, or use the spec directly.

**First-time setup (UI):**

1. Push this repo to GitHub (see below).
2. In DigitalOcean → **Apps** → **Create App** → pick your GitHub repo `markcabs26/axloxo`, branch `main`.
3. App Platform will auto-detect Next.js. Confirm:
   - Build command: `npm run build`
   - Run command: `npm start`
   - HTTP port: `3000`
4. Add environment variables (mark sensitive ones as **encrypted**):
   - `STRIPE_SECRET_KEY` — your live or test key
   - `RESEND_API_KEY` — optional, for custom request emails
   - `RESEND_FROM` — e.g. `Axloxo <orders@axloxo.com>`
   - `CUSTOM_REQUEST_TO` — e.g. `mark@payready.com`
   - `NEXT_PUBLIC_SITE_URL` — `https://axloxo.com`
5. Pick the smallest plan (Basic `basic-xxs` is plenty) and deploy.

**Custom domain (`axloxo.com`):**

1. In the app → **Settings** → **Domains** → add `axloxo.com` and `www.axloxo.com`.
2. DigitalOcean will show the records to set. If your DNS is managed in DigitalOcean already, it can configure them automatically; otherwise point your registrar's records at the hostnames DO provides. TLS certs are issued automatically.

**Updating the Stripe success URL:**

The checkout session uses the request's `origin` header, so once the custom domain is live no code changes are needed. You can still set `NEXT_PUBLIC_SITE_URL=https://axloxo.com` as a belt-and-suspenders default.

## Git: first push

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/markcabs26/axloxo.git
git push -u origin main
```
