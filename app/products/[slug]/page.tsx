import { sanityClient, productBySlugQuery, recommendedProductsQuery } from '@/lib/sanity';
import type { ProductRow } from '@/types/database';
import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';

async function getProduct(slug: string): Promise<ProductRow | null> {
  try {
    const data = await sanityClient.fetch<ProductRow | null>(productBySlugQuery, { slug });
    return data;
  } catch (err) {
    console.error('Error fetching product by slug from Sanity:', err);
    return null;
  }
}

async function getRecommendedProducts(
  productId: string,
  categories: string[]
): Promise<ProductRow[]> {
  try {
    const data = await sanityClient.fetch<ProductRow[]>(recommendedProductsQuery, {
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
