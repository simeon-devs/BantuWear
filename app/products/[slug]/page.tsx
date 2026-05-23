import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ProductRow } from '@/types/database';
import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';

async function getProduct(slug: string): Promise<ProductRow | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return (data ?? null) as ProductRow | null;
}

async function getRecommendedProducts(
  productId: string,
  categories: string[]
): Promise<ProductRow[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('id', productId)
    .contains('categories', categories.length > 0 ? [categories[0]] : [])
    .limit(4);
  if (error || !data) return [];
  return data as ProductRow[];
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
