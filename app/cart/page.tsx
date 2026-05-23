'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotal = useCartStore((state) => state.cartTotal());

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal py-32 px-6 text-center">
        <h1 className="font-display text-4xl text-gold mb-4">Your Cart</h1>
        <p className="text-cream/50 mb-8">Your cart is empty</p>
        <Link
          href="/products"
          className="inline-block bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide uppercase transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-4xl text-gold">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-cream/40 hover:text-terracotta text-sm transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.selectedSize}`}
              className="flex gap-6 p-4 bg-charcoal-800 rounded-2xl"
            >
              <div className="w-24 h-24 bg-charcoal-700 rounded-xl overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cream/20">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-cream font-sans font-medium">{item.name}</h3>
                <p className="text-cream/50 text-sm mt-1">Size: {item.selectedSize}</p>
                <p className="text-gold font-sans mt-2">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.selectedSize, Math.max(1, item.quantity - 1))
                  }
                  className="w-8 h-8 rounded-full bg-charcoal-700 hover:bg-charcoal-600 flex items-center justify-center text-cream/70 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-cream">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.selectedSize, item.quantity + 1)
                  }
                  className="w-8 h-8 rounded-full bg-charcoal-700 hover:bg-charcoal-600 flex items-center justify-center text-cream/70 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.productId, item.selectedSize)}
                className="p-2 text-cream/40 hover:text-terracotta transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-800">
          <div className="flex justify-between items-center mb-8">
            <span className="text-cream/60 font-sans">Subtotal</span>
            <span className="text-2xl text-gold font-display">${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-terracotta hover:bg-terracotta-600 text-white py-4 rounded-full font-sans text-sm tracking-wide uppercase transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
