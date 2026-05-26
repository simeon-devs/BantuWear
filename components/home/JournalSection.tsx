'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const articles = [
  {
    number: '01',
    category: 'CULTURE',
    title: 'The Ndop Cloth: Sacred Threads of the Grassfields',
    excerpt:
      'Woven by the Bamiléké people of Cameroon, Ndop fabric carries centuries of royal symbolism in every indigo thread — a living archive of Grassfields identity that refuses to be silent.',
    image: px(34747815),
    readTime: '6 MIN READ',
    date: 'MAY 2025',
    featured: true,
  },
  {
    number: '02',
    category: 'STYLE',
    title: 'Modern Ankara: How African Prints Conquered Global Streetwear',
    excerpt:
      'From Lagos to London, the wax-print revolution is redefining what luxury means for a new generation.',
    image: px(7745487),
    readTime: '4 MIN READ',
    date: 'APR 2025',
    featured: false,
  },
  {
    number: '03',
    category: 'CRAFT',
    title: 'Douala Collective: Photographers Reshaping African Fashion',
    excerpt:
      'A new wave of image-makers is reclaiming the visual narrative of African style on the world stage.',
    image: px(6937912),
    readTime: '5 MIN READ',
    date: 'MAR 2025',
    featured: false,
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IMG: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function FeaturedCard({ article }: { article: (typeof articles)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.72, ease: EASE }}
    >
      <Link href="#" className="group block">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-charcoal-800 aspect-[3/4]"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {/* Image */}
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.06 },
            }}
            transition={{ duration: 0.85, ease: EASE_IMG }}
          />

          {/* Dark gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-transparent" />

          {/* Giant issue number — editorial watermark */}
          <div
            className="absolute -top-2 left-4 font-display leading-none select-none pointer-events-none"
            style={{
              fontSize: 'clamp(5rem, 10vw, 8rem)',
              color: 'rgba(224,89,54,0.35)',
              letterSpacing: '-0.04em',
            }}
          >
            {article.number}
          </div>

          {/* Category badge */}
          <div className="absolute top-7 right-6">
            <span className="border border-cream/25 text-cream/65 font-sans text-[9px] tracking-[0.35em] uppercase px-3 py-1 rounded-full backdrop-blur-sm bg-charcoal/25">
              {article.category}
            </span>
          </div>

          {/* Bottom text block */}
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="text-cream/40 font-sans text-[10px] tracking-[0.3em] uppercase mb-3">
              {article.readTime} · {article.date}
            </p>
            <h3 className="font-display text-2xl md:text-[1.75rem] text-cream leading-tight">
              {article.title}
            </h3>

            {/* Excerpt: reveals on hover, clips from below */}
            <div className="overflow-hidden">
              <motion.p
                className="text-cream/55 font-sans text-sm leading-relaxed mt-3 mb-4"
                variants={{
                  rest: { y: '115%', opacity: 0 },
                  hover: { y: 0, opacity: 1 },
                }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                {article.excerpt}
              </motion.p>
            </div>

            {/* "Read Article" link — reveals on hover */}
            <motion.div
              className="flex items-center gap-2 text-terracotta font-sans text-[10px] tracking-[0.25em] uppercase"
              variants={{
                rest: { x: -12, opacity: 0 },
                hover: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.3, delay: 0.07, ease: EASE }}
            >
              Read Article
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function SecondaryCard({
  article,
  delay,
}: {
  article: (typeof articles)[0];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      <Link href="#" className="group flex gap-5 items-stretch">
        {/* Portrait image — narrow */}
        <div className="relative w-[110px] flex-shrink-0 overflow-hidden rounded-2xl bg-charcoal-800">
          <motion.img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: EASE_IMG }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />

          {/* Issue number */}
          <div className="absolute bottom-2 left-3 font-display text-2xl text-terracotta/60 leading-none select-none">
            {article.number}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center gap-2 min-w-0 py-1">
          <span className="inline-flex items-center self-start border border-terracotta/45 text-terracotta font-sans text-[8px] tracking-[0.35em] uppercase px-2.5 py-0.5 rounded-full">
            {article.category}
          </span>
          <h3 className="font-display text-lg text-cream leading-snug line-clamp-3 group-hover:text-terracotta transition-colors duration-300">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            <p className="text-cream/35 font-sans text-[9px] tracking-[0.25em] uppercase">
              {article.readTime} · {article.date}
            </p>
            <motion.div
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-terracotta" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function JournalSection() {
  const [featured, ...secondary] = articles;

  return (
    <section className="py-28 px-6 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-terracotta font-sans text-[10px] tracking-[0.4em] uppercase mb-2">
              Issue 2025
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-cream">The Journal</h2>
          </motion.div>

          <motion.div
            className="flex flex-col md:items-end gap-2.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-cream/40 font-sans text-sm max-w-[260px] md:text-right leading-relaxed">
              Stories, culture, and craft from the African fashion frontier.
            </p>
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-cream/45 hover:text-terracotta font-sans text-[10px] tracking-[0.28em] uppercase transition-colors group"
            >
              All Stories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Gold rule draws in on scroll */}
        <div className="mb-12">
          <svg viewBox="0 0 1000 2" className="w-full" aria-hidden="true">
            <motion.line
              x1="0" y1="1" x2="1000" y2="1"
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

        {/* Card grid — featured left, secondary stack right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-start">
          {/* Left: featured portrait */}
          <FeaturedCard article={featured} />

          {/* Right: two secondary cards + teaser */}
          <div className="flex flex-col gap-7">
            {secondary.map((article, i) => (
              <SecondaryCard key={article.number} article={article} delay={i * 0.14} />
            ))}

            {/* Editorial note / pull quote at the bottom */}
            <motion.div
              className="mt-2 pt-7 border-t border-charcoal-800"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <p className="font-display text-xl text-gold/70 italic leading-snug mb-4">
                "Fashion is the armour to survive the reality of everyday life."
              </p>
              <p className="text-cream/30 font-sans text-[10px] tracking-[0.3em] uppercase">
                — Diana Vreeland
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
