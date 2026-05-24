# BantuWear

Premium African streetwear e-commerce platform rooted in Bantu and Cameroonian cultural heritage. Where ancestral craftsmanship meets contemporary silhouettes.

## Stack

- **Next.js 13** (App Router) + TypeScript
- **Sanity** - CMS for products, users, and orders (with embedded Sanity Studio at `/studio`)
- **NextAuth.js v4** - JWT-based auth with credentials provider
- **Tailwind CSS** + **shadcn/ui** for styling
- **Zustand** - client-side cart state (persisted to localStorage)
- **Three.js** + **@react-three/fiber** - interactive 3D product viewer
- Deployed on **Netlify**

## Features

- Product catalog with size selection, categories, and 3D model viewer
- Persistent shopping cart (survives page refresh)
- Email and password authentication (accounts stored in Sanity)
- Order placement with PENDING to PAID to SHIPPED lifecycle
- Admin-ready: order and user management via Sanity Studio

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` at the project root:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_editor_token
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

- Get `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_WRITE_TOKEN` (Editor role) from [sanity.io/manage](https://sanity.io/manage)
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Run

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### 4. Sanity Studio

```bash
cd studio && npm install && npx sanity dev
```

Studio runs at [http://localhost:3333](http://localhost:3333). Use it to manage products, view orders, and manage users.

## Stripe (planned)

Payment integration is the next milestone. The checkout form and orders API are already structured to accept a Stripe `paymentIntentId` without schema changes.
