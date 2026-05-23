import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-gold hover:text-terracotta transition-colors"
            >
              BantuWear
            </Link>
            <p className="mt-4 text-cream/50 font-sans text-sm leading-relaxed max-w-md">
              Where ancestral craftsmanship meets contemporary design. BantuWear brings
              the spirit of African heritage to the global fashion stage.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-cream font-sans text-xs tracking-widest uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-cream/50 hover:text-gold text-sm transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-cream/50 hover:text-gold text-sm transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-cream/50 hover:text-gold text-sm transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-cream font-sans text-xs tracking-widest uppercase mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/bantuwear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-terracotta transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/bantuwear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-terracotta transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-charcoal-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-xs font-sans">
            {currentYear} BantuWear. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-cream/30 hover:text-cream/50 text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-cream/30 hover:text-cream/50 text-xs transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
