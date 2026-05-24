import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });
else dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2023-05-25',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

const PRODUCTS = [
  {
    id: 'seed-product-1',
    title: 'Ankara Bomber Jacket',
    slug: 'ankara-bomber-jacket',
    price: 285,
    categories: ['Outerwear', 'Jackets'],
    description:
      'Bold Ankara wax-print bomber jacket with contrast rib cuffs and collar. Each panel is hand-cut from premium Dutch wax fabric sourced directly from West African textile markets. Unisex relaxed fit.',
    imageUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=800&q=80',
  },
  {
    id: 'seed-product-2',
    title: 'Kente Silk Kimono',
    slug: 'kente-silk-kimono',
    price: 395,
    categories: ['Kimonos', 'Luxury'],
    description:
      'Floor-length kimono woven from pure silk with Kente-inspired gold and black geometric patterns. A statement piece bridging ancestral Ghanaian weaving traditions with contemporary silhouettes.',
    imageUrl: 'https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?w=800&q=80',
  },
  {
    id: 'seed-product-3',
    title: 'Batik Oversized Hoodie',
    slug: 'batik-oversized-hoodie',
    price: 195,
    categories: ['Hoodies', 'Streetwear'],
    description:
      'Premium heavyweight 400gsm cotton hoodie with hand-dyed batik detailing on the chest and sleeves. Relaxed drop-shoulder fit, dyed using traditional African-inspired resist techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1529245019870-59b249281fd3?w=800&q=80',
  },
  {
    id: 'seed-product-4',
    title: 'Dashiki Oversized Tee',
    slug: 'dashiki-oversized-tee',
    price: 125,
    categories: ['Tops', 'Streetwear'],
    description:
      'Relaxed-fit oversized tee with chest panel featuring embroidered Dashiki geometric motifs in terracotta and gold on premium 100% Pima cotton. The everyday cultural staple.',
    imageUrl: 'https://images.unsplash.com/photo-1561764981-1925f98905f0?w=800&q=80',
  },
  {
    id: 'seed-product-5',
    title: 'Mudcloth Wide-Leg Trousers',
    slug: 'mudcloth-wide-leg-trousers',
    price: 245,
    categories: ['Bottoms', 'Luxury'],
    description:
      'High-waisted wide-leg trousers crafted from Malian Bogolan (mudcloth) fabric. Each pair features unique hand-painted geometric symbols — no two are identical. Heritage meets high fashion.',
    imageUrl: 'https://images.unsplash.com/photo-1628144029346-8a98676311b6?w=800&q=80',
  },
  {
    id: 'seed-product-6',
    title: 'Adire Cargo Jacket',
    slug: 'adire-cargo-jacket',
    price: 345,
    categories: ['Outerwear', 'Jackets'],
    description:
      'Technical cargo jacket with six pockets, crafted from Yoruba Adire (tie-dye) cotton. Indigo blue and white patterns achieved through traditional resist-dyeing using cassava paste.',
    imageUrl: 'https://images.unsplash.com/photo-1559634757-9ab59209827b?w=800&q=80',
  },
  {
    id: 'seed-product-7',
    title: 'Kanga Wrap Dress',
    slug: 'kanga-wrap-dress',
    price: 220,
    categories: ['Dresses', 'Luxury'],
    description:
      'Midi wrap dress crafted from East African Kanga fabric featuring vibrant printed motifs and a Swahili proverb border. Adjustable tie waist. Ethically produced in Nairobi.',
    imageUrl: 'https://images.unsplash.com/photo-1625989744655-9bff7a23dac4?w=800&q=80',
  },
  {
    id: 'seed-product-8',
    title: 'Afrofuturist Puffer Vest',
    slug: 'afrofuturist-puffer-vest',
    price: 265,
    categories: ['Outerwear', 'Streetwear'],
    description:
      'Quilted puffer vest with Ankara fabric panelling over the chest and back. Recycled down fill. A collision of Afrofuturist aesthetics and high-performance outerwear design.',
    imageUrl: 'https://images.unsplash.com/photo-1625646741211-711bdd65c570?w=800&q=80',
  },
];

async function uploadImage(url: string, filename: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  });
  return asset._id;
}

async function seed() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === 'placeholder-sanity-id') {
    console.error('\n❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set or is still the placeholder.');
    console.error('   Add your real project ID to .env.local and try again.\n');
    process.exit(1);
  }
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('\n❌  SANITY_WRITE_TOKEN is not set.');
    console.error('   Go to sanity.io/manage → API → Tokens → create an Editor token.\n');
    process.exit(1);
  }

  console.log(`\n🌍  BantuWear seed — ${PRODUCTS.length} products → project: ${projectId}\n`);

  for (const p of PRODUCTS) {
    process.stdout.write(`  ⏳  ${p.title} ...`);
    try {
      // Upload the Unsplash image as a real Sanity asset
      const assetId = await uploadImage(p.imageUrl, `${p.slug}.jpg`);

      await client.createOrReplace({
        _id: p.id,
        _type: 'product',
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        price: p.price,
        description: p.description,
        categories: p.categories,
        images: [
          {
            _type: 'image',
            _key: 'main',
            asset: { _type: 'reference', _ref: assetId },
          },
        ],
      });

      process.stdout.write(`  ✅\n`);
    } catch (err) {
      process.stdout.write(`  ❌\n`);
      console.error(`     ${(err as Error).message}`);
    }
  }

  console.log('\n✨  Done! Run `npm run dev` and visit http://localhost:3000\n');
}

seed();
