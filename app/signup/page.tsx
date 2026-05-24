'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      try {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong. Please try again.');
      } catch {
        setError('Something went wrong. Please try again.');
      }
      setIsLoading(false);
      return;
    }

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
    });
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
            Create your account and join the movement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-cream/60 font-sans text-xs tracking-widest uppercase mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent border border-charcoal-700 rounded-xl px-5 py-4 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
              placeholder="Your name"
            />
          </div>

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
                minLength={8}
                className="w-full bg-transparent border border-charcoal-700 rounded-xl px-5 py-4 pr-12 text-cream placeholder:text-cream/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/50 transition-all"
                placeholder="At least 8 characters"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-cream/60 font-sans text-xs tracking-widest uppercase mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full bg-transparent border rounded-xl px-5 py-4 text-cream placeholder:text-cream/30 focus:outline-none focus:ring-1 transition-all ${
                passwordsMatch
                  ? 'border-charcoal-700 focus:border-terracotta focus:ring-terracotta/50'
                  : 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
              }`}
              placeholder="Confirm your password"
            />
            {!passwordsMatch && (
              <p className="mt-2 text-red-400 text-xs">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 w-4 h-4 rounded border-charcoal-700 bg-transparent text-terracotta focus:ring-terracotta/50"
            />
            <label htmlFor="terms" className="text-cream/50 text-sm leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-terracotta hover:text-gold transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-terracotta hover:text-gold transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full bg-gold hover:bg-gold-600 disabled:bg-charcoal-700 text-charcoal py-4 rounded-full font-sans text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-cream/50 text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-terracotta hover:text-gold transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
