import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const products: Database['public']['Tables']['products']['Insert'][] = [
  {
    name: 'Bantu Oversized Street Hoodie',
    slug: 'bantu-oversized-street-hoodie',
    description:
      'A statement piece born from the streets of Lagos and Accra. This heavyweight drop-shoulder hoodie features hand-embroidered Adinkra symbols across the chest and sleeves, fusing ancestral iconography with contemporary streetwear silhouettes. Crafted from 400gsm French terry cotton in deep charcoal with complex geometric patterns in deep earth tones.',
    price: 189.0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    categories: ['Hoodies', 'Streetwear', 'Tops'],
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1627376662993-9c8646b976f9?w=1200&q=85',
    ],
    model_3d_url: '/models/placeholder-torso.glb',
    tags: ['Streetwear', 'Bantu Geometric', 'hoodie', 'adinkra', 'lagos', 'oversized'],
  },
  {
    name: 'Ankara Kimono Duster',
    slug: 'ankara-kimono-duster',
    description:
      'Where Kyoto meets Kinshasa. This floor-length kimono duster is cut from vibrant hand-printed Ankara wax fabric sourced directly from artisan workshops in Abidjan. The highly detailed, intricate motifs and bold geometric patterns in terracotta, gold and forest green create a wearable work of art.',
    price: 325.0,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    categories: ['Outerwear', 'Dresses', 'Ankara'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1518049360814-1f7481b4b9b7?w=1200&q=85',
    ],
    model_3d_url: '/models/placeholder-torso.glb',
    tags: ['Contemporary', 'Traditional Print', 'Intricate', 'ankara', 'kimono', 'duster', 'wax-print', 'afrofusion'],
  },
  {
    name: 'Kente Tech Bomber Jacket',
    slug: 'kente-tech-bomber-jacket',
    description:
      'The future of African fashion is now. Our signature Kente Tech Bomber merges traditional hand-woven Kente strip panels from Ghana with a structured contemporary bomber silhouette. Classic Kente cloth weaving with geometric block patterns, matte black technical fabric, YKK zippers, and hidden interior pockets.',
    price: 445.0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categories: ['Jackets', 'Outerwear', 'Kente'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1582276527588-466d183b6329?w=1200&q=85',
    ],
    model_3d_url: '/models/placeholder-torso.glb',
    tags: ['Techwear', 'Modern Kente', 'kente', 'bomber', 'jacket', 'ghana', 'technical', 'luxury'],
  },
  {
    name: 'Afro-Futurist Cargo Trousers',
    slug: 'afro-futurist-cargo-trousers',
    description:
      'Designed for those who move between worlds. These wide-leg cargo trousers in heavyweight ripstop cotton feature stylized Afro-futurist patterns with metallic highlights, laser-cut tribal pattern panels at the thigh pockets and embroidered Zulu beadwork accents. A utility silhouette elevated to haute couture.',
    price: 265.0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    categories: ['Trousers', 'Bottoms', 'Streetwear'],
    stock: 34,
    images: [
      'https://images.unsplash.com/photo-1614959547071-6101c7784f18?w=1200&q=85',
    ],
    model_3d_url: '/models/placeholder-torso.glb',
    tags: ['Futurist', 'Utilitarian', 'cargo', 'trousers', 'zulu', 'afrofuturism', 'wide-leg'],
  },
];

async function seed() {
  console.log('Seeding BantuWear products...\n');

  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Failed to seed "${product.name}":`, error.message);
    } else if (data) {
      const row = data as { id: string; name: string };
      console.log(`Seeded: ${row.name} (${row.id})`);
    }
  }

  console.log('\nSeed complete.');
}

seed().catch(console.error);
