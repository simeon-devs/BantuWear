import { sanityClient, productsQuery } from '@/lib/sanity';
import type { SanityProduct } from '@/types/sanity';
import { ProductsGrid } from './products-grid';
import { FALLBACK_PRODUCTS } from './fallback-products';

async function getProducts(): Promise<SanityProduct[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || projectId === 'placeholder-sanity-id') return FALLBACK_PRODUCTS;

    const data = await sanityClient.fetch<SanityProduct[]>(productsQuery, {}, { cache: 'no-store' });
    if (!data || data.length === 0) return FALLBACK_PRODUCTS;
    return data;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

function getCategories(products: SanityProduct[]): string[] {
  const allCategories = new Set<string>();
  products.forEach((p) => p.categories?.forEach((c) => allCategories.add(c)));
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

  const products = await getProducts();
  const categories = getCategories(products);

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
