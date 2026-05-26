'use client';

import { motion } from 'framer-motion';

const pillars = [
  {
    label: 'Premium Craftsmanship',
    desc: 'Hand-selected materials and artisan techniques',
    color: 'bg-terracotta/10',
    accent: 'text-terracotta',
    stroke: '#E05936',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    ),
  },
  {
    label: 'Ethically Sourced',
    desc: 'Direct partnerships with African artisans',
    color: 'bg-forest/20',
    accent: 'text-forest',
    stroke: '#1B4332',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    label: 'Worldwide Shipping',
    desc: 'Free express delivery on orders over $200',
    color: 'bg-gold/10',
    accent: 'text-gold',
    stroke: '#D4AF37',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
  },
];

export function PillarsSection() {
  return (
    <section className="py-24 px-6 border-t border-charcoal-800">
      {/* Top gold rule */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-center">
        <svg viewBox="0 0 400 2" className="w-40" aria-hidden="true">
          <motion.line
            x1="0" y1="1" x2="400" y2="1"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              delay: i * 0.15,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="flex flex-col items-center group cursor-default"
          >
            {/* Icon circle */}
            <motion.div
              className={`w-14 h-14 rounded-full ${pillar.color} flex items-center justify-center mb-5 transition-colors duration-300 group-hover:scale-110`}
              whileHover={{ scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg
                className={`w-6 h-6 ${pillar.accent}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke={pillar.stroke}
              >
                {pillar.icon}
              </svg>
            </motion.div>

            <h3 className="text-cream font-sans font-medium mb-2 text-sm tracking-wide">
              {pillar.label}
            </h3>
            <p className="text-cream/45 text-sm leading-relaxed max-w-[200px]">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
