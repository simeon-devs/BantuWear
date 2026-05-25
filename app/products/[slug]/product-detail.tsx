'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Check, ArrowRight } from 'lucide-react';
import { useCartStore, useCurrencyStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import type { SanityProduct } from '@/types/sanity';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Import Product3DViewer dynamically on client-side to prevent hydration mismatch/SSR errors
const Product3DViewer = dynamic(() => import('@/components/Product3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px] bg-charcoal-950/40 rounded-3xl flex items-center justify-center border border-charcoal-800/30">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
    </div>
  ),
});

interface ProductDetailProps {
  product: SanityProduct;
  recommended: SanityProduct[];
}

export function ProductDetail({ product, recommended }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mediaMode, setMediaMode] = useState<'2D' | '3D'>('2D');

  const addToCart = useCartStore((state) => state.addToCart);
  const { currency } = useCurrencyStore();

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

  // Determine a premium theme color based on product metadata (tags, categories, name)
  const get3DColor = () => {
    const text = `${product.name} ${product.description} ${product.categories?.join(' ')} ${product.tags?.join(' ')}`.toLowerCase();
    if (text.includes('ankara') || text.includes('duster') || text.includes('kimono') || text.includes('terracotta')) {
      return '#E05936'; // Terracotta
    }
    if (text.includes('kente') || text.includes('gold') || text.includes('hoodie')) {
      return '#D4AF37'; // Gold
    }
    if (text.includes('cargo') || text.includes('trouser') || text.includes('bottom') || text.includes('zulu')) {
      return '#1B4332'; // Forest Green
    }
    return '#888888'; // Clean metallic silver/charcoal
  };

  const viewerColor = get3DColor();

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            {/* Premium Translucent Glass Media Toggle */}
            <div className="flex justify-center gap-1.5 mb-6 bg-charcoal-900/60 p-1.5 rounded-full border border-charcoal-700/30 max-w-[280px]">
              <button
                onClick={() => setMediaMode('2D')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-full font-sans text-[11px] tracking-widest uppercase transition-all duration-300 font-medium',
                  mediaMode === '2D'
                    ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20'
                    : 'text-cream/60 hover:text-cream'
                )}
              >
                📷 Image
              </button>
              <button
                onClick={() => setMediaMode('3D')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-full font-sans text-[11px] tracking-widest uppercase transition-all duration-300 font-medium',
                  mediaMode === '3D'
                    ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20'
                    : 'text-cream/60 hover:text-cream'
                )}
              >
                🧊 3D View
              </button>
            </div>

            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-charcoal-800 mb-6 relative">
              {mediaMode === '3D' ? (
                <Product3DViewer
                  color={viewerColor}
                  name={product.name}
                  modelUrl={product.model_3d_url}
                  imageUrl={product.images?.[0]}
                />
              ) : product.images?.[selectedImage] ? (
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
                    onClick={() => {
                      setSelectedImage(idx);
                      setMediaMode('2D'); // Automatically switch to 2D view on thumbnail click
                    }}
                    className={cn(
                      'flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden transition-all',
                      selectedImage === idx && mediaMode === '2D'
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
            <p className="text-gold font-sans text-3xl mb-8">{formatPrice(product.price, currency)}</p>

            <p className="text-cream/60 font-sans leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="text-cream/60 font-sans text-xs tracking-widest uppercase mb-3">
                Select Size
              </p>
              <div className="flex flex-wrap gap-3">
                {(product.sizes && product.sizes.length > 0
                  ? product.sizes
                  : ['XS', 'S', 'M', 'L', 'XL']
                ).map((size) => (
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
                  <p className="text-gold font-sans text-sm">{formatPrice(item.price, currency)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
