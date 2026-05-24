import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sanityClient } from '@/lib/sanity';
import type { ProductRow } from '@/types/database';

// Query to fetch the 4 latest featured products from Sanity
const featuredProductsQuery = `*[_type == "product"] | order(_createdAt desc)[0...4] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  "images": images[].asset->url,
  categories
}`;

async function getFeaturedProducts(): Promise<ProductRow[]> {
  try {
    const data = await sanityClient.fetch<ProductRow[]>(featuredProductsQuery);
    return data || [];
  } catch (err) {
    console.error('Error fetching featured products from Sanity:', err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-charcoal">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1558618666-f325158c21a3?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/70 to-charcoal" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-terracotta font-sans text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in">
            African Heritage. Global Vision.
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.1] mb-8 animate-slide-up">
            BantuWear
            <span className="block text-gold mt-2">Rooted in Future</span>
          </h1>
          <p className="text-cream/60 font-sans text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Where ancestral craftsmanship meets contemporary silhouettes. Premium African
            streetwear designed for the modern visionary.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-600 text-white px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all group"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gold">Featured</h2>
              <p className="text-cream/50 font-sans mt-2">Curated selection from our collection</p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-cream/60 hover:text-terracotta font-sans text-sm transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative bg-charcoal-800 rounded-2xl overflow-hidden"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-charcoal-700 flex items-center justify-center text-cream/20">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-5">
                  <p className="text-cream/60 font-sans text-xs tracking-widest uppercase mb-2">
                    {product.categories?.[0] ?? 'Apparel'}
                  </p>
                  <h3 className="text-cream font-sans font-medium mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gold font-sans">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-terracotta hover:text-gold font-sans text-sm transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1517918037356-a64c87503603?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
            Bantu &amp; Cameroonian Heritage
          </h2>
          <p className="text-cream/60 font-sans text-lg leading-relaxed mb-8">
            Born from the vibrant traditions of the Bantu-speaking peoples of Central Africa,
            our designs carry the spirit of ancestral craftsmanship into the modern era.
            From the intricate patterns of Kente cloth to the bold geometry of Ankara wax prints,
            every piece tells a story of cultural pride and artistic excellence.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-charcoal px-8 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all"
          >
            Discover Our Story
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-cream font-sans font-medium mb-2">Premium Craftsmanship</h3>
            <p className="text-cream/50 text-sm">Hand-selected materials and artisan techniques</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-forest/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-cream font-sans font-medium mb-2">Ethically Sourced</h3>
            <p className="text-cream/50 text-sm">Direct partnerships with African artisans</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-cream font-sans font-medium mb-2">Worldwide Shipping</h3>
            <p className="text-cream/50 text-sm">Free express delivery on orders over $200</p>
          </div>
        </div>
      </section>
    </div>
  );
}
