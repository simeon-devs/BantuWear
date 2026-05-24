'use client';

import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6 relative overflow-hidden">
      {/* Dynamic ambient color glows behind content to maintain ultra-premium feel */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto px-8 py-12 bg-charcoal-800/40 backdrop-blur-md rounded-3xl border border-charcoal-700/30 shadow-2xl animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-forest/20 border border-forest/30 flex items-center justify-center mx-auto mb-8 shadow-inner relative group">
          <div className="absolute inset-0 rounded-full bg-forest/10 animate-ping opacity-70" />
          <Check className="w-8 h-8 text-forest relative z-10" />
        </div>

        <p className="text-terracotta font-sans text-xs tracking-[0.3em] uppercase mb-4">
          Order Processed
        </p>

        <h1 className="font-display text-4xl md:text-5xl text-cream mb-6 leading-tight">
          Welcome to the
          <span className="block text-gold mt-1 font-serif">Future of Fashion</span>
        </h1>

        <p className="text-cream/60 font-sans text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
          Your order has been successfully placed. We have initiated direct coordination with our Central and West African artisan partners to begin prepping your premium streetwear garment.
        </p>

        <div className="p-5 rounded-2xl bg-charcoal-950/40 border border-charcoal-800/50 mb-10 text-left space-y-3">
          <div className="flex justify-between text-xs tracking-wider uppercase font-sans">
            <span className="text-cream/40">Status</span>
            <span className="text-forest font-medium">Preparing</span>
          </div>
          <div className="flex justify-between text-xs tracking-wider uppercase font-sans border-t border-charcoal-800/80 pt-3">
            <span className="text-cream/40">Shipment method</span>
            <span className="text-cream/80">Express Worldwide</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-full font-sans text-xs tracking-widest uppercase transition-all shadow-lg shadow-terracotta/10 group"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-charcoal-700 hover:border-cream text-cream/70 hover:text-cream px-8 py-3.5 rounded-full font-sans text-xs tracking-widest uppercase transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
