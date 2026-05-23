'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import type { ProductRow } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: ProductRow;
  recommended: ProductRow[];
}

export function ProductDetail({ product, recommended }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedSize,
      quantity,
      image: product.images?.[0] ?? '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-charcoal-800 mb-4">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream/20">
                  No Image
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden transition-all',
                      selectedImage === idx
                        ? 'ring-2 ring-terracotta'
                        : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-8">
            <p className="text-terracotta font-sans text-xs tracking-[0.2em] uppercase mb-4">
              {product.categories?.join(' / ') ?? 'Apparel'}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {product.name}
            </h1>
            <p className="text-gold font-sans text-3xl mb-8">${product.price.toFixed(2)}</p>

            <p className="text-cream/60 font-sans leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="text-cream/60 font-sans text-xs tracking-widest uppercase mb-3">
                Select Size
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-12 h-12 rounded-xl font-sans text-sm transition-all',
                      selectedSize === size
                        ? 'bg-terracotta text-white'
                        : 'bg-charcoal-800 text-cream/70 hover:text-cream hover:bg-charcoal-700'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <p className="text-cream/60 font-sans text-xs tracking-widest uppercase">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-charcoal-800 hover:bg-charcoal-700 flex items-center justify-center text-cream/70 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-cream font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-charcoal-800 hover:bg-charcoal-700 flex items-center justify-center text-cream/70 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={cn(
                'w-full py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2',
                !selectedSize
                  ? 'bg-charcoal-700 text-cream/30 cursor-not-allowed'
                  : added
                  ? 'bg-forest text-white'
                  : 'bg-terracotta hover:bg-terracotta-600 text-white'
              )}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
              <p className="mt-4 text-terracotta/80 text-sm text-center">
                Only {product.stock} left in stock
              </p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-charcoal-800">
                <p className="text-cream/40 text-xs">
                  Tags: {product.tags.map((t) => `#${t}`).join(' ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {recommended.length > 0 && (
          <section className="mt-24 pt-16 border-t border-charcoal-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-gold">You May Also Like</h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-cream/50 hover:text-terracotta text-sm transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-800 mb-3">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cream/20">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-cream font-sans text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-gold font-sans text-sm">${item.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
