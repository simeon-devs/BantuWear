import { sanityClient, productBySlugQuery, recommendedProductsQuery } from '@/lib/sanity';
import type { SanityProduct } from '@/types/sanity';
import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';
import { FALLBACK_PRODUCTS } from '../fallback-products';

async function getProduct(slug: string): Promise<SanityProduct | null> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || projectId === 'placeholder-sanity-id') {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }

    const data = await sanityClient.fetch<SanityProduct | null>(productBySlugQuery, { slug }, { cache: 'no-store' });
    if (!data) return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
    return data;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

async function getRecommendedProducts(
  productId: string,
  categories: string[]
): Promise<SanityProduct[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || projectId === 'placeholder-sanity-id') {
      return FALLBACK_PRODUCTS.filter(
        (p) => p.id !== productId && p.categories?.some((c) => categories.includes(c))
      ).slice(0, 4);
    }

    const data = await sanityClient.fetch<SanityProduct[]>(recommendedProductsQuery, {
      productId,
      categories,
    }, { cache: 'no-store' });
    return data || [];
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();

  const recommended = await getRecommendedProducts(product.id, product.categories ?? []);

  return <ProductDetail product={product} recommended={recommended} />;
}
