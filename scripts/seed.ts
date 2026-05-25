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
    imageUrl: 'https://images.pexels.com/photos/16779591/pexels-photo-16779591.jpeg?w=800',
  },
  {
    id: 'seed-product-2',
    title: 'Kente Silk Kimono',
    slug: 'kente-silk-kimono',
    price: 395,
    categories: ['Kimonos', 'Luxury'],
    description:
      'Floor-length kimono woven from pure silk with Kente-inspired gold and black geometric patterns. A statement piece bridging ancestral Ghanaian weaving traditions with contemporary silhouettes.',
    imageUrl: 'https://images.pexels.com/photos/12716001/pexels-photo-12716001.jpeg?w=800',
  },
  {
    id: 'seed-product-3',
    title: 'Batik Oversized Hoodie',
    slug: 'batik-oversized-hoodie',
    price: 195,
    categories: ['Hoodies', 'Streetwear'],
    description:
      'Premium heavyweight 400gsm cotton hoodie with hand-dyed batik detailing on the chest and sleeves. Relaxed drop-shoulder fit, dyed using traditional African-inspired resist techniques.',
    imageUrl: 'https://images.pexels.com/photos/29625972/pexels-photo-29625972.jpeg?w=800',
  },
  {
    id: 'seed-product-4',
    title: 'Dashiki Oversized Tee',
    slug: 'dashiki-oversized-tee',
    price: 125,
    categories: ['Tops', 'Streetwear'],
    description:
      'Relaxed-fit oversized tee with chest panel featuring embroidered Dashiki geometric motifs in terracotta and gold on premium 100% Pima cotton. The everyday cultural staple.',
    imageUrl: 'https://images.pexels.com/photos/6192562/pexels-photo-6192562.jpeg?w=800',
  },
  {
    id: 'seed-product-5',
    title: 'Mudcloth Wide-Leg Trousers',
    slug: 'mudcloth-wide-leg-trousers',
    price: 245,
    categories: ['Bottoms', 'Luxury'],
    description:
      'High-waisted wide-leg trousers crafted from Malian Bogolan (mudcloth) fabric. Each pair features unique hand-painted geometric symbols — no two are identical. Heritage meets high fashion.',
    imageUrl: 'https://images.pexels.com/photos/33821727/pexels-photo-33821727.jpeg?w=800',
  },
  {
    id: 'seed-product-6',
    title: 'Adire Cargo Jacket',
    slug: 'adire-cargo-jacket',
    price: 345,
    categories: ['Outerwear', 'Jackets'],
    description:
      'Technical cargo jacket with six pockets, crafted from Yoruba Adire (tie-dye) cotton. Indigo blue and white patterns achieved through traditional resist-dyeing using cassava paste.',
    imageUrl: 'https://images.unsplash.com/photo-1529245019870-59b249281fd3?w=800&q=80',
  },
  {
    id: 'seed-product-7',
    title: 'Kanga Wrap Dress',
    slug: 'kanga-wrap-dress',
    price: 220,
    categories: ['Dresses', 'Luxury'],
    description:
      'Midi wrap dress crafted from East African Kanga fabric featuring vibrant printed motifs and a Swahili proverb border. Adjustable tie waist. Ethically produced in Nairobi.',
    imageUrl: 'https://images.pexels.com/photos/20370167/pexels-photo-20370167.jpeg?w=800',
  },
  {
    id: 'seed-product-8',
    title: 'Afrofuturist Puffer Vest',
    slug: 'afrofuturist-puffer-vest',
    price: 265,
    categories: ['Outerwear', 'Streetwear'],
    description:
      'Quilted puffer vest with Ankara fabric panelling over the chest and back. Recycled down fill. A collision of Afrofuturist aesthetics and high-performance outerwear design.',
    imageUrl: 'https://images.pexels.com/photos/7856728/pexels-photo-7856728.jpeg?w=800',
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
