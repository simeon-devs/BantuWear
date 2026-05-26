import { sanityClient } from '@/lib/sanity';
import type { SanityProduct } from '@/types/sanity';
import { FALLBACK_PRODUCTS } from './products/fallback-products';
import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { JournalSection } from '@/components/home/JournalSection';
import { HeritageBanner } from '@/components/home/HeritageBanner';
import { PillarsSection } from '@/components/home/PillarsSection';

const featuredQuery = `*[_type == "product"] | order(_createdAt desc)[0...4] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  "images": images[].asset->url,
  categories
}`;

async function getFeaturedProducts(): Promise<SanityProduct[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || projectId === 'placeholder-sanity-id') return FALLBACK_PRODUCTS.slice(0, 4);

    const data = await sanityClient.fetch<SanityProduct[]>(featuredQuery, {}, { cache: 'no-store' });
    if (!data || data.length === 0) return FALLBACK_PRODUCTS.slice(0, 4);
    return data;
  } catch {
    return FALLBACK_PRODUCTS.slice(0, 4);
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-charcoal">
      <HeroSection />
      <MarqueeStrip />
      <FeaturedGrid products={products} />
      <JournalSection />
      <HeritageBanner />
      <PillarsSection />
    </div>
  );
}
