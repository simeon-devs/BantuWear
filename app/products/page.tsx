import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ProductRow } from '@/types/database';
import { ProductsGrid } from './products-grid';

async function getProducts(
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<ProductRow[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.contains('categories', [category]);
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as ProductRow[];
}

async function getCategories(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('categories');
  if (error || !data) return [];
  const allCategories = new Set<string>();
  data.forEach((p) => p.categories?.forEach((c) => allCategories.add(c)));
  return Array.from(allCategories).sort();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const minPrice = params.min ? parseFloat(params.min) : undefined;
  const maxPrice = params.max ? parseFloat(params.max) : undefined;

  const [products, categories] = await Promise.all([
    getProducts(selectedCategory, minPrice, maxPrice),
    getCategories(),
  ]);

  return (
    <ProductsGrid
      products={products}
      categories={categories}
      selectedCategory={selectedCategory}
      minPrice={minPrice}
      maxPrice={maxPrice}
    />
  );
}
