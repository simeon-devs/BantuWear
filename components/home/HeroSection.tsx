'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BRAND = 'BantuWear';

const shapes = [
  { x: '7%',  top: '16%', size: 54, delay: 0.3, color: '#E05936', dur: 3.6 },
  { x: '87%', top: '20%', size: 36, delay: 0.9, color: '#D4AF37', dur: 4.4 },
  { x: '79%', top: '67%', size: 72, delay: 1.5, color: '#E05936', dur: 5.1 },
  { x: '3%',  top: '73%', size: 46, delay: 0.6, color: '#D4AF37', dur: 3.9 },
  { x: '48%', top: '7%',  size: 28, delay: 1.1, color: '#1B4332', dur: 4.6 },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade      = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">

      {/* Parallax hero photo */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-f325158c21a3?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
          scale: 1.15,
        }}
      />

      {/* Colour overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/25 via-transparent to-charcoal/25" />

      {/* Ankara-inspired geometric pattern */}
      <div className="absolute inset-0 opacity-45 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ankara-hero" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <polygon points="50,8 92,50 50,92 8,50"   fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.35"/>
              <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="#E05936" strokeWidth="0.5" opacity="0.22"/>
              <circle cx="50" cy="50" r="2.5" fill="#D4AF37" opacity="0.22"/>
              <line x1="50" y1="0"  x2="50" y2="100" stroke="#D4AF37" strokeWidth="0.3" opacity="0.14"/>
              <line x1="0"  y1="50" x2="100" y2="50" stroke="#D4AF37" strokeWidth="0.3" opacity="0.14"/>
              <polygon points="0,0 14,0 0,14"       fill="#1B4332" opacity="0.22"/>
              <polygon points="100,0 86,0 100,14"   fill="#1B4332" opacity="0.22"/>
              <polygon points="0,100 14,100 0,86"   fill="#1B4332" opacity="0.22"/>
              <polygon points="100,100 86,100 100,86" fill="#1B4332" opacity="0.22"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ankara-hero)"/>
        </svg>
      </div>

      {/* Floating diamonds */}
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: s.x, top: s.top }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.13, scale: 1 }}
          transition={{ delay: s.delay + 1.6, duration: 0.8, type: 'spring', stiffness: 180 }}
        >
          <motion.div
            animate={{ y: [0, -13, 0], rotate: [45, 53, 45] }}
            transition={{ delay: s.delay + 2.4, duration: s.dur, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 60 60" fill="none">
              <polygon points="30,2 58,30 30,58 2,30" fill={s.color} />
              <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke={s.color} strokeWidth="1.5" opacity="0.55"/>
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: contentY, opacity: fade }}
      >
        {/* Pre-title */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          <motion.div
            className="h-px bg-terracotta"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
          <p className="text-terracotta font-sans text-[11px] tracking-[0.35em] uppercase">
            African Heritage · Global Vision
          </p>
          <motion.div
            className="h-px bg-terracotta"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>

        {/* Letter-by-letter heading */}
        <div style={{ perspective: '1200px' }}>
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-cream leading-[0.9] mb-3 flex flex-wrap justify-center">
            {BRAND.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: -80, opacity: 0, rotateX: -80 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.4 + i * 0.065,
                  type: 'spring',
                  stiffness: 220,
                  damping: 20,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Gold underline draw */}
        <div className="flex justify-center mb-7">
          <svg viewBox="0 0 480 10" className="w-full max-w-[480px]" aria-hidden="true">
            <motion.path
              d="M10 5 Q240 1 470 5"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.1, duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
        </div>

        {/* Subtitle slide-up */}
        <div className="overflow-hidden mb-10">
          <motion.p
            className="font-display text-2xl md:text-3xl text-gold italic tracking-wide"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            Rooted in Future
          </motion.p>
        </div>

        {/* Description */}
        <motion.p
          className="text-cream/55 font-sans text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
        >
          Where ancestral craftsmanship meets contemporary silhouettes.
          Premium African streetwear for the modern visionary.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.52, type: 'spring', stiffness: 190, damping: 18 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta-600 text-white px-10 py-4 rounded-full font-sans text-[11px] tracking-[0.25em] uppercase transition-colors group relative overflow-hidden"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        style={{ opacity: fade }}
      >
        <span className="text-cream/30 font-sans text-[9px] tracking-[0.35em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent"
          animate={{ scaleY: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
