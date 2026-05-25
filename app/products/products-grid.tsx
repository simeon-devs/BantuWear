'use client';

import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { SanityProduct } from '@/types/sanity';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/lib/store';

interface ProductsGridProps {
  products: SanityProduct[];
  categories: string[];
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function ProductsGrid({
  products,
  categories,
  selectedCategory,
  minPrice: initialMin,
  maxPrice: initialMax,
}: ProductsGridProps) {
  const { currency } = useCurrencyStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(selectedCategory ?? null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMin ?? 0,
    initialMax ?? 600,
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (category && !p.categories?.includes(category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  }, [products, category, priceRange]);

  const priceRanges = [
    { label: 'All', min: 0, max: 600 },
    { label: 'Under $200', min: 0, max: 199 },
    { label: '$200 - $300', min: 200, max: 300 },
    { label: '$300 - $400', min: 300, max: 400 },
    { label: '$400+', min: 400, max: 600 },
  ];

  const handlePriceSelect = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const clearFilters = () => {
    setCategory(null);
    setPriceRange([0, 600]);
  };

  const hasFilters = category !== null || priceRange[0] > 0 || priceRange[1] < 600;

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-gold">The Collection</h1>
            <p className="text-cream/50 font-sans mt-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 text-cream/60 hover:text-cream font-sans text-sm transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {filtersOpen && (
          <div className="mb-12 p-6 bg-charcoal-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-cream font-sans text-sm tracking-widest uppercase">Filters</h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-cream/50 hover:text-terracotta text-sm transition-colors"
                >
                  Clear All
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-3">Category</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-sans transition-colors',
                      category === null
                        ? 'bg-terracotta text-white'
                        : 'bg-charcoal-700 text-cream/60 hover:text-cream'
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-sans transition-colors',
                        category === cat
                          ? 'bg-terracotta text-white'
                          : 'bg-charcoal-700 text-cream/60 hover:text-cream'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-cream/60 text-xs tracking-widest uppercase mb-3">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceSelect(range.min, range.max)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-sans transition-colors',
                        priceRange[0] === range.min && priceRange[1] === range.max
                          ? 'bg-terracotta text-white'
                          : 'bg-charcoal-700 text-cream/60 hover:text-cream'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-cream/40 text-lg mb-4">No products match your filters</p>
            <button
              onClick={clearFilters}
              className="text-terracotta hover:text-gold transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-800 mb-4">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-40" />
                </div>
                <div>
                  <p className="text-cream/50 font-sans text-xs tracking-widest uppercase mb-1">
                    {product.categories?.[0] ?? 'Apparel'}
                  </p>
                  <h3 className="text-cream font-sans font-medium mb-1">{product.name}</h3>
                  <p className="text-gold font-sans">{formatPrice(product.price, currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
