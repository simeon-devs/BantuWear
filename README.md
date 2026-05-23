# BantuWear

Premium African streetwear e-commerce platform rooted in Bantu and Cameroonian cultural heritage. Where ancestral craftsmanship meets contemporary silhouettes.

## Stack

- **Next.js 13** (App Router) + TypeScript
- **Supabase** - PostgreSQL database, auth, and row-level security
- **Tailwind CSS** + **shadcn/ui** for styling
- **Zustand** for client-side cart and session state
- Deployed on **Netlify**

## Features

- Product catalog with size selection, categories, and 3D model support
- Persistent shopping cart (survives page refresh)
- User auth with ADMIN / CUSTOMER roles
- Order management with PENDING → PAID → SHIPPED lifecycle

## Getting Started

```bash
npm install
npm run dev
```

Set up your Supabase project and add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), then run the migration in `supabase/migrations/` to initialize the schema.
