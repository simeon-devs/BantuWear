'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="font-display text-3xl text-gold hover:text-terracotta transition-colors"
          >
            BantuWear
          </Link>
          <p className="mt-4 text-cream/50 font-sans text-sm">
            Welcome back. Sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-cream/60 font-sans text-xs tracking-widest uppercase mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-charcoal-700 rounded-xl px-5 py-4 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-cream/60 font-sans text-xs tracking-widest uppercase mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-charcoal-700 rounded-xl px-5 py-4 pr-12 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-charcoal-700 bg-transparent text-terracotta focus:ring-terracotta/50"
              />
              <span className="text-cream/50 text-sm">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-terracotta hover:text-gold text-sm transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-terracotta hover:bg-terracotta-600 disabled:bg-charcoal-700 text-white py-4 rounded-full font-sans text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-cream/50 text-sm">
          Do not have an account?{' '}
          <Link
            href="/signup"
            className="text-gold hover:text-terracotta transition-colors font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
