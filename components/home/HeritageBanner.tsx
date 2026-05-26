'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const BODY =
  'Born from the vibrant traditions of the Bantu-speaking peoples of Central Africa, our designs carry the spirit of ancestral craftsmanship into the modern era. From the intricate patterns of Kente cloth to the bold geometry of Ankara wax prints, every piece tells a story of cultural pride and artistic excellence.';

export function HeritageBanner() {
  const words = BODY.split(' ');

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1517918037356-a64c87503603?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-charcoal/80" />

      {/* Ankara pattern — lighter density */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ankara-heritage" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="30" cy="30" r="2" fill="#D4AF37" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ankara-heritage)"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
          </motion.div>
        </motion.div>

        {/* Gold line */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 320 4" className="w-40" aria-hidden="true">
            <motion.line
              x1="0" y1="2" x2="320" y2="2"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
        </div>

        {/* Heading */}
        <motion.h2
          className="font-display text-4xl md:text-5xl text-cream mb-8 leading-tight"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Bantu &amp; Cameroonian Heritage
        </motion.h2>

        {/* Word-by-word body text */}
        <p className="text-cream/60 font-sans text-lg leading-relaxed mb-10">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.28em]"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.032, duration: 0.35, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-charcoal px-8 py-3 rounded-full font-sans text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
          >
            Discover Our Story
          </Link>
        </motion.div>

        {/* Bottom gold line */}
        <div className="flex justify-center mt-8">
          <svg viewBox="0 0 320 4" className="w-40" aria-hidden="true">
            <motion.line
              x1="0" y1="2" x2="320" y2="2"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
