# Supabase → Sanity + NextAuth Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Supabase entirely and replace it with Sanity (users + orders as documents) and NextAuth.js v4 (JWT sessions via credentials provider), leaving the project Stripe-ready.

**Architecture:** Sanity is the single data store — products (already done), users, and orders all live as Sanity documents. NextAuth handles stateless JWT sessions; credentials are verified by bcrypt-comparing against the `passwordHash` field on the Sanity user document. No session database is needed. A separate write-token Sanity client handles mutations (create user, create order) while the existing read client handles queries.

**Tech Stack:** Next.js 13 App Router, next-sanity + @sanity/client, next-auth v4, bcryptjs, Zustand (cart only — user store removed)

---

## Current State (what already works)

- Homepage, products list, product detail → all fetch from Sanity ✅
- 3D viewer, cart (Zustand) → no Supabase dependency ✅
- Login/signup pages → placeholder `setTimeout`, no real auth yet
- Checkout → uses `useUserStore` (to be replaced by NextAuth session), order submission is a fake timeout
- Header → static "Account" link, no auth state
- `app/api/products/route.ts`, `app/api/products/[slug]/route.ts` → Supabase (to be deleted, pages fetch directly from Sanity)
- `app/api/orders/route.ts` → Supabase (to be rewritten)
- `lib/supabase/` → to be deleted

---

## File Map

**Create:**
- `lib/sanity-write.ts` — Sanity write client (uses `SANITY_WRITE_TOKEN`)
- `lib/auth.ts` — NextAuth `authOptions` (CredentialsProvider + JWT callbacks)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- `app/api/auth/signup/route.ts` — POST signup endpoint
- `types/next-auth.d.ts` — extend Session with `id` and `role`
- `components/providers.tsx` — client component wrapping `SessionProvider`
- `studio/schemas/user.ts` — Sanity user document schema
- `studio/schemas/order.ts` — Sanity order document schema (items embedded)

**Modify:**
- `studio/schemas/index.ts` — register user + order schemas
- `lib/sanity.ts` — add `userByEmailQuery`
- `app/layout.tsx` — wrap children with `<Providers>`
- `app/login/page.tsx` — wire `handleSubmit` to `signIn('credentials', ...)`
- `app/signup/page.tsx` — POST to `/api/auth/signup`, then `signIn`
- `components/layout/header.tsx` — show session state (account/logout)
- `app/api/orders/route.ts` — rewrite GET + POST to use Sanity
- `app/checkout/page.tsx` — use NextAuth session, POST to `/api/orders`
- `lib/store.ts` — remove `useUserStore` (replaced by NextAuth session)
- `package.json` — add next-auth, bcryptjs; remove @supabase/supabase-js

**Delete:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `app/api/products/route.ts`
- `app/api/products/[slug]/route.ts`

---

## Task 1: Install + uninstall packages

**Files:** `package.json`

- [ ] **Step 1: Install NextAuth and bcryptjs**

```bash
cd /Users/sims/Projects/BantuWear
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

Expected: packages added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Remove Supabase**

```bash
npm uninstall @supabase/supabase-js
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap @supabase/supabase-js for next-auth + bcryptjs"
```

---

## Task 2: Sanity write client

**Files:** Create `lib/sanity-write.ts`

- [ ] **Step 1: Create the write client**

```ts
// lib/sanity-write.ts
import { createClient } from '@sanity/client';

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2023-05-25',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
```

- [ ] **Step 2: Add `SANITY_WRITE_TOKEN` to `.env.local`**

In your Sanity project dashboard → API → Tokens → create a token with **Editor** permissions. Add to `.env.local`:

```
SANITY_WRITE_TOKEN=your_token_here
```

- [ ] **Step 3: Commit**

```bash
git add lib/sanity-write.ts .env.local
git commit -m "feat: add Sanity write client"
```

---

## Task 3: Sanity user + order schemas

**Files:** Create `studio/schemas/user.ts`, `studio/schemas/order.ts`, modify `studio/schemas/index.ts`

- [ ] **Step 1: Create user schema**

```ts
// studio/schemas/user.ts
import { defineType, defineField } from 'sanity';

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'passwordHash',
      title: 'Password Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: ['CUSTOMER', 'ADMIN'] },
      initialValue: 'CUSTOMER',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'role' },
  },
});
```

- [ ] **Step 2: Create order schema**

```ts
// studio/schemas/order.ts
import { defineType, defineField } from 'sanity';

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', readOnly: true }),
    defineField({ name: 'userEmail', title: 'User Email', type: 'string', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['PENDING', 'PAID', 'SHIPPED'] },
      initialValue: 'PENDING',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (USD)',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Full Name' },
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'Product ID' },
            { name: 'name', type: 'string', title: 'Product Name' },
            { name: 'price', type: 'number', title: 'Unit Price' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'size', type: 'string', title: 'Size' },
            { name: 'image', type: 'string', title: 'Image URL' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'userEmail', subtitle: 'status' },
  },
});
```

- [ ] **Step 3: Register both schemas**

```ts
// studio/schemas/index.ts
import { product } from './product';
import { user } from './user';
import { order } from './order';

export const schemaTypes = [product, user, order];
```

- [ ] **Step 4: Commit**

```bash
git add studio/schemas/
git commit -m "feat: add user and order schemas to Sanity Studio"
```

---

## Task 4: NextAuth configuration

**Files:** Create `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `types/next-auth.d.ts`. Modify `lib/sanity.ts`.

- [ ] **Step 1: Add userByEmailQuery to Sanity client**

Append to `lib/sanity.ts`:

```ts
export const userByEmailQuery = `*[_type == "user" && email == $email][0] {
  "_id": _id,
  email,
  passwordHash,
  role
}`;
```

- [ ] **Step 2: Create authOptions**

```ts
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sanityClient, userByEmailQuery } from './sanity';

interface SanityUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await sanityClient.fetch<SanityUser | null>(userByEmailQuery, {
          email: credentials.email,
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user._id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { id: string; email: string; role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

- [ ] **Step 3: Create NextAuth route handler**

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 4: Extend NextAuth session types**

```ts
// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}
```

- [ ] **Step 5: Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` to `.env.local`**

Generate a secret with: `openssl rand -base64 32`

```
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

- [ ] **Step 6: Commit**

```bash
git add lib/auth.ts lib/sanity.ts app/api/auth/ types/next-auth.d.ts .env.local
git commit -m "feat: configure NextAuth with Sanity credentials provider"
```

---

## Task 5: Signup API route

**Files:** Create `app/api/auth/signup/route.ts`

- [ ] **Step 1: Create signup endpoint**

```ts
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sanityClient, userByEmailQuery } from '@/lib/sanity';
import { sanityWriteClient } from '@/lib/sanity-write';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body as { email?: string; password?: string; name?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await sanityClient.fetch(userByEmailQuery, { email });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sanityWriteClient.create({
    _type: 'user',
    email,
    name: name ?? '',
    passwordHash,
    role: 'CUSTOMER',
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/signup/route.ts
git commit -m "feat: add signup API route — creates user document in Sanity"
```

---

## Task 6: Wire up login page

**Files:** Modify `app/login/page.tsx`

- [ ] **Step 1: Replace the stub handleSubmit**

Replace only the state and `handleSubmit` section at the top of the component, keeping all JSX:

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  // ... keep all existing JSX below, add error display after the form's opening tag:
  // {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
```

- [ ] **Step 2: Add error display inside the form JSX**

In the existing `<form>` element, add just before the first `<div>`:

```tsx
{error && (
  <p className="text-red-400 text-sm text-center -mt-2 mb-2">{error}</p>
)}
```

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: wire login page to NextAuth credentials signIn"
```

---

## Task 7: Wire up signup page

**Files:** Modify `app/signup/page.tsx`

- [ ] **Step 1: Replace stub handleSubmit**

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
      setIsLoading(false);
      return;
    }

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
    });
  };

  // ... keep all existing JSX, add error display in form:
  // {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
```

- [ ] **Step 2: Add error display inside the form JSX** (same pattern as login step 2)

- [ ] **Step 3: Commit**

```bash
git add app/signup/page.tsx
git commit -m "feat: wire signup page to /api/auth/signup then auto-signIn"
```

---

## Task 8: Add SessionProvider to layout

**Files:** Create `components/providers.tsx`, modify `app/layout.tsx`

- [ ] **Step 1: Create client Providers component**

```tsx
// components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- [ ] **Step 2: Wrap layout children**

In `app/layout.tsx`, add the import and wrap `<main>`:

```tsx
import { Providers } from '@/components/providers';

// Inside RootLayout, replace the <body> contents:
<body className="font-sans bg-charcoal text-cream antialiased">
  <Providers>
    <Header />
    <main className="min-h-screen pt-20">{children}</main>
    <Footer />
  </Providers>
</body>
```

- [ ] **Step 3: Commit**

```bash
git add components/providers.tsx app/layout.tsx
git commit -m "feat: add NextAuth SessionProvider to root layout"
```

---

## Task 9: Update header with auth state

**Files:** Modify `components/layout/header.tsx`

- [ ] **Step 1: Replace static "Account" link with session-aware controls**

```tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.cartCount());
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'Our Story' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-charcoal/80 backdrop-blur-xl border-b border-charcoal-800'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl md:text-3xl tracking-tight text-gold hover:text-terracotta transition-colors"
        >
          BantuWear
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/80 hover:text-gold font-sans text-sm tracking-wide uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-cream/80 hover:text-terracotta transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta text-charcoal-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="hidden md:flex items-center gap-1.5 text-cream/80 hover:text-terracotta font-sans text-sm tracking-wide uppercase transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 text-cream/80 hover:text-gold font-sans text-sm tracking-wide uppercase transition-colors"
            >
              <User className="w-4 h-4" />
              Account
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-cream/80 hover:text-terracotta transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal/95 backdrop-blur-xl border-t border-charcoal-800">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-cream/80 hover:text-gold font-sans text-sm tracking-wide uppercase transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-left text-cream/80 hover:text-terracotta font-sans text-sm tracking-wide uppercase transition-colors py-2"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-cream/80 hover:text-gold font-sans text-sm tracking-wide uppercase transition-colors py-2"
              >
                Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/header.tsx
git commit -m "feat: header shows sign-out when session active, sign-in when not"
```

---

## Task 10: Rewrite orders API for Sanity

**Files:** Modify `app/api/orders/route.ts`

- [ ] **Step 1: Rewrite the route**

```ts
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sanityClient } from '@/lib/sanity';
import { sanityWriteClient } from '@/lib/sanity-write';

const ordersByUserQuery = `*[_type == "order" && userId == $userId] | order(_createdAt desc) {
  "_id": _id,
  status,
  totalAmount,
  items,
  shippingAddress,
  "_createdAt": _createdAt
}`;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await sanityClient.fetch(ordersByUserQuery, { userId: session.user.id });
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { items, totalAmount, shippingAddress } = body;

  if (!items?.length || !totalAmount || !shippingAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const order = await sanityWriteClient.create({
    _type: 'order',
    userId: session.user.id,
    userEmail: session.user.email,
    status: 'PENDING',
    totalAmount,
    shippingAddress,
    items,
  });

  return NextResponse.json({ order }, { status: 201 });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/orders/route.ts
git commit -m "feat: rewrite orders API to use Sanity write client"
```

---

## Task 11: Update checkout page

**Files:** Modify `app/checkout/page.tsx`

- [ ] **Step 1: Replace useUserStore with useSession and wire up real order submission**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader as Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    paymentMethod: 'card',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const finalTotal = cartTotal >= 200 ? cartTotal : cartTotal + 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsLoading(true);
    setOrderError('');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          image: item.image,
        })),
        totalAmount: finalTotal,
        shippingAddress: {
          name: form.name,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
      }),
    });

    setIsLoading(false);

    if (!res.ok) {
      setOrderError('Could not place order. Please try again.');
      return;
    }

    clearCart();
    router.push('/checkout/success');
  };

  // ... keep all existing JSX unchanged below.
  // Replace useUserStore references: remove `user` variable.
  // Replace form initial email with: email: session?.user?.email ?? ''
  // Add error display above submit button:
  // {orderError && <p className="text-red-400 text-sm text-center">{orderError}</p>}
```

- [ ] **Step 2: Redirect to login if not authenticated**

Add after the `cart.length === 0` early-return block:

```tsx
if (!session) {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl text-gold mb-4">Sign in to checkout</h1>
        <p className="text-cream/50 mb-8">You need an account to place an order</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide uppercase transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/checkout/page.tsx
git commit -m "feat: checkout uses NextAuth session and posts real orders to Sanity"
```

---

## Task 12: Remove Supabase

**Files:** Delete `lib/supabase/`, `app/api/products/route.ts`, `app/api/products/[slug]/route.ts`. Modify `lib/store.ts`.

- [ ] **Step 1: Delete Supabase files**

```bash
rm lib/supabase/client.ts lib/supabase/server.ts
rmdir lib/supabase
rm app/api/products/route.ts
rm "app/api/products/[slug]/route.ts"
rmdir "app/api/products/[slug]"
rmdir app/api/products
```

- [ ] **Step 2: Remove useUserStore from lib/store.ts**

Delete the entire `useUserStore` block (lines ~50–65). The file should only export `useCartStore` and the `CartItem` interface. Final file:

```ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  selectedSize: string;
  quantity: number;
  image: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (i) => i.productId === item.productId && i.selectedSize === item.selectedSize
          );
          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += item.quantity;
            return { cart: updated };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (productId, selectedSize) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.productId === productId && i.selectedSize === selectedSize)
          ),
        })),
      updateQuantity: (productId, selectedSize, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId && i.selectedSize === selectedSize ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'bantuwear-cart' }
  )
);
```

- [ ] **Step 3: Run typecheck to confirm no remaining Supabase imports**

```bash
npm run typecheck 2>&1 | grep -i supabase
```

Expected: no output (zero Supabase references).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove Supabase — delete client, server, product API routes, useUserStore"
```

---

## Task 13: Update README

**Files:** Modify `README.md`

- [ ] **Step 1: Update stack section and setup instructions**

```markdown
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
- Email + password authentication (accounts stored in Sanity)
- Order placement with PENDING → PAID → SHIPPED lifecycle
- Admin-ready: order and user management via Sanity Studio

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_editor_token
NEXTAUTH_SECRET=your_random_secret   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

Get your Sanity project ID and write token from [sanity.io/manage](https://sanity.io/manage).
Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Run

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### 4. Sanity Studio (content management)

```bash
cd studio && npm install && npx sanity dev
```

Studio: [http://localhost:3333](http://localhost:3333)

## Stripe (planned)

Payment integration is the next milestone. The checkout form and order API are already structured to accept a Stripe `paymentIntentId` without schema changes.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for Sanity + NextAuth stack"
```

---

## Verification Checklist

Run through these manually after all tasks are done:

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run dev` starts without errors
- [ ] Sign up with a new email — user document appears in Sanity Studio
- [ ] Log in with that email/password — header shows "Sign Out"
- [ ] Add product to cart, go to checkout — form is pre-filled with email
- [ ] Place order — order document appears in Sanity Studio with PENDING status
- [ ] Sign out — header shows "Account" again
- [ ] All product pages still load from Sanity
- [ ] Cart persists across page refreshes
