'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader as Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore, useCurrencyStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const { currency } = useCurrencyStore();

  const [form, setForm] = useState({
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    paymentMethod: 'card',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const finalTotal = cartTotal >= 200 ? cartTotal : cartTotal + 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsLoading(true);
    setOrderError('');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          image: item.image,
        })),
        totalAmount: finalTotal,
        shippingAddress: {
          name: form.name,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
      }),
    });

    setIsLoading(false);

    if (!res.ok) {
      setOrderError('Could not place your order. Please try again.');
      return;
    }

    clearCart();
    router.push('/checkout/success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl text-gold mb-4">Your cart is empty</h1>
          <p className="text-cream/50 mb-8">Add some items to proceed with checkout</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide uppercase transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl text-gold mb-4">Sign in to checkout</h1>
          <p className="text-cream/50 mb-8">You need an account to place an order</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3 rounded-full font-sans text-sm tracking-wide uppercase transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-12 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-cream font-sans text-sm tracking-widest uppercase mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-cream font-sans text-sm tracking-widest uppercase mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                      Address
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                        City
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                        Postal Code
                      </label>
                      <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                        Country
                      </label>
                      <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border border-charcoal-700 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
          </div>

              <div>
                <h2 className="text-cream font-sans text-sm tracking-widest uppercase mb-4">
                  Payment Method
                </h2>
                <div className="flex gap-4">
                  {['card', 'paypal'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method })}
                      className={`flex-1 py-4 px-6 rounded-xl font-sans text-sm capitalize transition-all ${
                        form.paymentMethod === method
                          ? 'bg-terracotta text-white'
                          : 'bg-charcoal-800 text-cream/60 hover:text-cream'
                      }`}
                    >
                      {method === 'card' ? 'Credit Card' : 'PayPal'}
                    </button>
                  ))}
                </div>
              </div>

              {orderError && (
                <p className="text-red-400 text-sm text-center">{orderError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-600 disabled:bg-charcoal-700 text-charcoal py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-charcoal-800 rounded-2xl p-6 sticky top-28">
              <h2 className="text-cream font-sans text-sm tracking-widest uppercase mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-charcoal-700 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream/20 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-cream text-sm line-clamp-1">{item.name}</p>
                      <p className="text-cream/50 text-xs mt-1">Size: {item.selectedSize}</p>
                      <p className="text-cream/50 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gold font-sans text-sm">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-charcoal-700 pt-4 space-y-2">
                <div className="flex justify-between text-cream/60 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal, currency)}</span>
                </div>
                <div className="flex justify-between text-cream/60 text-sm">
                  <span>Shipping</span>
                  <span>{cartTotal >= 200 ? 'Free' : formatPrice(15, currency)}</span>
                </div>
                <div className="flex justify-between text-cream font-sans text-lg pt-2">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
