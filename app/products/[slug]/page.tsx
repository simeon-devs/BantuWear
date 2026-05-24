import { sanityClient, productBySlugQuery, recommendedProductsQuery } from '@/lib/sanity';
import type { SanityProduct } from '@/types/sanity';
import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';

async function getProduct(slug: string): Promise<SanityProduct | null> {
  try {
    const data = await sanityClient.fetch<SanityProduct | null>(productBySlugQuery, { slug });
    return data;
  } catch (err) {
    console.error('Error fetching product by slug from Sanity:', err);
    return null;
  }
}

async function getRecommendedProducts(
  productId: string,
  categories: string[]
): Promise<SanityProduct[]> {
  try {
    const data = await sanityClient.fetch<SanityProduct[]>(recommendedProductsQuery, {
      productId,
      categories,
    });
    return data || [];
  } catch (err) {
    console.error('Error fetching recommended products from Sanity:', err);
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
