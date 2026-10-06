# Little Meadow

**Little Meadow by Ayra & Hadin** is a kidswear storefront for ages 1 to 5 years. Products are managed in Supabase, customers browse by Boy / Girl, build a bag, and place orders that are sent to the store owner on WhatsApp.

**Live site:** https://little-meadow-pk.vercel.app

**Repository:** https://github.com/Jabranibrar/little-meadow

---

## Features

- Product catalogue loaded from Supabase
- Boy / Girl / Collection filtering (desktop nav and mobile hamburger menu)
- Size selection per product (1-2Y to 4-5Y)
- Shopping bag drawer with quantity controls and product thumbnails
- Checkout form with Cash on Delivery
- Order summary sent to the store via WhatsApp
- Our Story section and Exchange & Return Policy page
- Fully responsive layout with a fixed background image
- Optimized images with `next/image`
- SEO ready: metadata, Open Graph, `sitemap.xml`, `robots.txt`

## Tech Stack

| Area      | Technology                               |
| --------- | ---------------------------------------- |
| Framework | Next.js (App Router)                     |
| Language  | TypeScript                               |
| UI        | React, Tailwind CSS v4                   |
| Fonts     | Cormorant Garamond, Nunito (`next/font`) |
| Database  | Supabase (PostgreSQL)                    |
| Hosting   | Vercel                                   |

## Project Structure

```
app/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   ├── CheckoutModal.tsx
│   └── Footer.tsx
├── exchange-policy/
│   └── page.tsx
├── lib/
│   └── supabase.ts
├── globals.css
├── icon.png
├── layout.tsx
├── page.tsx
├── robots.ts
├── sitemap.ts
└── types.ts
public/
└── little-meadow.jpeg
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Jabranibrar/little-meadow.git
cd little-meadow
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Both values are in the Supabase dashboard under **Project Settings → API**. Never commit `.env.local`.

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

### 4. Production build

```bash
npm run build
npm start
```

## Supabase Setup

Create a `products` table:

| Column       | Type        | Notes                                 |
| ------------ | ----------- | ------------------------------------- |
| `id`         | int8        | Primary key                           |
| `created_at` | timestamptz | Default `now()`                       |
| `title`      | text        | Product name                          |
| `price`      | numeric     | In PKR                                |
| `image`      | text        | Public image URL                      |
| `category`   | text        | e.g. `Clothing`                       |
| `gender`     | text        | `boy`, `girl` or `unisex` (lowercase) |
| `stock`      | int4        | Available quantity                    |

Enable **Row Level Security** and add a `SELECT` policy for the `anon` role so the storefront can read products.

```sql
alter table products enable row level security;

create policy "Public can read products"
on products for select
to anon
using (true);
```

## Product Images

Remote image hosts must be allowed in `next.config.ts`. Currently allowed:

- Supabase Storage (`<project-id>.supabase.co`)
- Adobe Stock CDN (`**.ftcdn.net`)

When using a new image host, add it to `images.remotePatterns` and restart the dev server. Uploading images to Supabase Storage is recommended.

## Deployment

The project is deployed on Vercel. Every push to the main branch triggers a new deployment.

1. Import the repository in Vercel.
2. Add the two environment variables from `.env.local` in **Project Settings → Environment Variables**.
3. Deploy.

If the site URL changes, update it in `app/layout.tsx` (`metadataBase`), `app/sitemap.ts` and `app/robots.ts`.

## SEO

- Metadata and Open Graph tags in `app/layout.tsx`
- Sitemap at `/sitemap.xml`
- Robots rules at `/robots.txt`
- Submit the sitemap in Google Search Console after deployment

## Roadmap

- [ ] Save orders to a Supabase `orders` table
- [ ] Email confirmation for customer and store owner
- [ ] Custom `.pk` domain
- [ ] Additional payment methods (bank transfer)

## License

All rights reserved. © 2026 Little Meadow by Ayra & Hadin.

_Made with love for little moments._
