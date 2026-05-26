'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { useCurrencyStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import type { SanityProduct } from '@/types/sanity';

interface FeaturedGridProps {
  products: SanityProduct[];
}

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];
const EASE_IMG = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.65,
      ease: EASE_OUT,
    },
  }),
};

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25 } },
};

const imgVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.07, transition: { duration: 0.55, ease: EASE_IMG } },
};

export function FeaturedGrid({ products }: FeaturedGridProps) {
  const { currency } = useCurrencyStore();

  if (products.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-terracotta font-sans text-[10px] tracking-[0.35em] uppercase mb-2">
              Latest Arrivals
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-gold">Featured</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/products"
              className="hidden md:flex items-center gap-1.5 text-cream/50 hover:text-terracotta font-sans text-xs tracking-widest uppercase transition-colors group"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <Link href={`/products/${product.slug}`} className="group block">
                <motion.div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-800 mb-4"
                  variants={{ rest: {}, hover: {} }}
                  initial="rest"
                  whileHover="hover"
                >
                  {/* Product image */}
                  {product.images?.[0] ? (
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      variants={imgVariants}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20 text-xs">
                      No Image
                    </div>
                  )}

                  {/* Gradient base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-charcoal/55 flex items-center justify-center"
                    variants={overlayVariants}
                  >
                    <div className="flex items-center gap-2 border border-cream/30 text-cream px-5 py-2.5 rounded-full font-sans text-[10px] tracking-[0.25em] uppercase backdrop-blur-sm">
                      View Product
                      <MoveUpRight className="w-3 h-3" />
                    </div>
                  </motion.div>

                  {/* Category chip */}
                  {product.categories?.[0] && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-charcoal/70 backdrop-blur-sm text-cream/70 font-sans text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-charcoal-700/40">
                        {product.categories[0]}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Text */}
                <div className="px-1">
                  <h3 className="text-cream font-sans text-sm font-medium mb-1 line-clamp-1 group-hover:text-terracotta transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-gold font-sans text-sm">{formatPrice(product.price, currency)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <motion.div
          className="mt-10 text-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-terracotta hover:text-gold font-sans text-xs tracking-widest uppercase transition-colors"
          >
            View All Products
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
