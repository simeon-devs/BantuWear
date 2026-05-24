import { sanityClient, productsQuery } from '@/lib/sanity';
import type { SanityProduct } from '@/types/sanity';
import { ProductsGrid } from './products-grid';

async function getProducts(): Promise<SanityProduct[]> {
  try {
    const data = await sanityClient.fetch<SanityProduct[]>(productsQuery);
    return data || [];
  } catch (err) {
    console.error('Error fetching products from Sanity:', err);
    return [];
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

