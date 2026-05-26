'use client';

import Link from 'next/link';
import { SlidersHorizontal, X, MoveUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IMG: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function ProductCard({ product, index }: { product: SanityProduct; index: number }) {
  const { currency } = useCurrencyStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: Math.min(index * 0.07, 0.42), duration: 0.65, ease: EASE }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        {/* Card image area */}
        <motion.div
          className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-800 mb-4"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {/* Product image */}
          {product.images?.[0] ? (
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.08 },
              }}
              transition={{ duration: 0.85, ease: EASE_IMG }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-charcoal-800">
              <svg viewBox="0 0 60 60" className="w-16 h-16 text-charcoal-600" aria-hidden="true">
                <polygon points="30,2 58,30 30,58 2,30" fill="currentColor" />
                <polygon points="30,16 44,30 30,44 16,30" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              </svg>
            </div>
          )}

          {/* Bottom gradient — always present for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
          {/* Top gradient — subtle dark for badge legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-transparent" />

          {/* Category badge — top left, frosted */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block bg-charcoal/55 backdrop-blur-md border border-cream/15 text-cream/75 font-sans text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 rounded-full">
              {product.categories?.[0] ?? 'Apparel'}
            </span>
          </div>

          {/* Low stock badge — top right */}
          {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-block bg-terracotta text-white font-sans text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full">
                {product.stock} left
              </span>
            </div>
          )}

          {/* Hover overlay — "View Product" CTA */}
          <motion.div
            className="absolute inset-0 flex items-end justify-center pb-6 z-10"
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-2 border border-cream/40 bg-charcoal/50 backdrop-blur-sm text-cream font-sans text-[10px] tracking-[0.25em] uppercase px-6 py-2.5 rounded-full"
              variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.28, delay: 0.05, ease: EASE }}
            >
              View Product
              <MoveUpRight className="w-3 h-3" />
            </motion.div>
          </motion.div>

          {/* Multi-image indicator dots */}
          {product.images && product.images.length > 1 && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
              variants={{ rest: { opacity: 0 }, hover: { opacity: 0 } }}
            >
              {/* Dots visible only in rest state via CSS */}
            </motion.div>
          )}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 group-hover:opacity-0 transition-opacity duration-200">
              {product.images.slice(0, 4).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    idx === 0 ? 'bg-cream/80' : 'bg-cream/25'
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Text row below image */}
        <div className="flex items-start justify-between gap-3 px-0.5">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-cream text-[1.05rem] leading-snug line-clamp-1 group-hover:text-terracotta transition-colors duration-300 mb-1">
              {product.name}
            </h3>
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-cream/30 font-sans text-[10px] tracking-widest">
                {product.sizes.slice(0, 5).join(' · ')}{product.sizes.length > 5 ? ' ···' : ''}
              </p>
            )}
          </div>
          <div className="text-right shrink-0 mt-0.5">
            <p className="text-gold font-sans text-sm font-medium">{formatPrice(product.price, currency)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductsGrid({
  products,
  categories,
  selectedCategory,
  minPrice: initialMin,
  maxPrice: initialMax,
}: ProductsGridProps) {
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
    { label: '$200–$300', min: 200, max: 300 },
    { label: '$300–$400', min: 300, max: 400 },
    { label: '$400+', min: 400, max: 600 },
  ];

  const clearFilters = () => {
    setCategory(null);
    setPriceRange([0, 600]);
  };

  const hasFilters = category !== null || priceRange[0] > 0 || priceRange[1] < 600;

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-terracotta font-sans text-[10px] tracking-[0.4em] uppercase mb-2">
              African Streetwear
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-gold">The Collection</h1>
            <p className="text-cream/40 font-sans text-sm mt-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </p>
          </motion.div>

          <motion.button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              'flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase transition-colors border rounded-full px-5 py-2.5',
              filtersOpen
                ? 'border-terracotta text-terracotta'
                : 'border-charcoal-700 text-cream/50 hover:text-cream hover:border-cream/30'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {filtersOpen ? 'Hide Filters' : 'Filter'}
          </motion.button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mb-12 p-6 bg-charcoal-900/60 border border-charcoal-800/80 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-cream/70 font-sans text-[10px] tracking-[0.35em] uppercase">Filters</h3>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-cream/40 hover:text-terracotta font-sans text-xs transition-colors"
                    >
                      Clear All
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-cream/40 font-sans text-[10px] tracking-[0.35em] uppercase mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategory(null)}
                        className={cn(
                          'px-4 py-1.5 rounded-full font-sans text-xs tracking-wide transition-all',
                          category === null
                            ? 'bg-terracotta text-white'
                            : 'border border-charcoal-700 text-cream/50 hover:text-cream hover:border-cream/30'
                        )}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={cn(
                            'px-4 py-1.5 rounded-full font-sans text-xs tracking-wide transition-all',
                            category === cat
                              ? 'bg-terracotta text-white'
                              : 'border border-charcoal-700 text-cream/50 hover:text-cream hover:border-cream/30'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-cream/40 font-sans text-[10px] tracking-[0.35em] uppercase mb-3">Price Range</h4>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => setPriceRange([range.min, range.max])}
                          className={cn(
                            'px-4 py-1.5 rounded-full font-sans text-xs tracking-wide transition-all',
                            priceRange[0] === range.min && priceRange[1] === range.max
                              ? 'bg-terracotta text-white'
                              : 'border border-charcoal-700 text-cream/50 hover:text-cream hover:border-cream/30'
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <motion.div
            className="text-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-cream/30 font-display text-2xl mb-4">No pieces match your filters</p>
            <button
              onClick={clearFilters}
              className="text-terracotta hover:text-gold font-sans text-sm transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
