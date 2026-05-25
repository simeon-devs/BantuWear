import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const PRODUCTS = [
  // ─── WOMEN'S DRESSES ──────────────────────────────────────────────────────
  {
    id: 'seed-product-1',
    title: 'Kanga Wrap Dress',
    slug: 'kanga-wrap-dress',
    price: 220,
    categories: ['Dresses', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Midi wrap dress crafted from East African Kanga fabric featuring vibrant printed motifs and a Swahili proverb border. Adjustable tie waist. Ethically produced in Nairobi, Kenya.',
    imageUrls: [px(10698019), px(20370167), px(2331507), px(17273207)],
  },
  {
    id: 'seed-product-2',
    title: 'Ankara Corset Dress',
    slug: 'ankara-corset-dress',
    price: 265,
    categories: ['Dresses', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Structured corset midi dress cut from premium Dutch wax Ankara print. Boned bodice, flared midi skirt. Makes a statement at any occasion — from Lagos rooftops to Accra galleries.',
    imageUrls: [px(6937912), px(7745487), px(34747815), px(18853893)],
  },
  {
    id: 'seed-product-3',
    title: 'Grand Boubou Kaftan',
    slug: 'grand-boubou-kaftan',
    price: 320,
    categories: ['Dresses', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Floor-length Grand Boubou kaftan in breathable embroidered cotton voile. A West African heritage silhouette modernised with clean lines and tonal embroidery at the collar and cuffs. Ships from Dakar.',
    imageUrls: [px(17273216), px(17273215), px(17273201), px(7465554)],
  },
  {
    id: 'seed-product-4',
    title: 'Dashiki Maxi Dress',
    slug: 'dashiki-maxi-dress',
    price: 175,
    categories: ['Dresses', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Relaxed floor-length maxi dress with an oversized Dashiki chest panel in terracotta and gold on jet-black 100% Pima cotton. Equal parts heritage and effortless everyday wear.',
    imageUrls: [px(12477588), px(7702284), px(6192596), px(943469)],
  },
  {
    id: 'seed-product-5',
    title: 'Adire Smocked Romper',
    slug: 'adire-smocked-romper',
    price: 155,
    categories: ['Dresses', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Playful smocked romper hand-dyed with Yoruba Adire resist technique. Each piece features a unique indigo and sky-blue pattern — no two are identical. Wide-leg cut, elastic waist.',
    imageUrls: [px(2703042), px(17192447), px(6192459), px(5569069)],
  },
  // ─── WOMEN'S BOTTOMS & SETS ──────────────────────────────────────────────
  {
    id: 'seed-product-6',
    title: 'Ankara Wide-Leg Trousers',
    slug: 'ankara-wide-leg-trousers',
    price: 185,
    categories: ['Bottoms', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'High-waisted wide-leg trousers cut from bold Ankara wax-print fabric. Tailored yet relaxed — pair with a fitted crop or let the print speak solo. A staple of contemporary West African street style.',
    imageUrls: [px(4617654), px(11552980), px(5569069), px(3973748)],
  },
  {
    id: 'seed-product-7',
    title: 'Mudcloth Wide-Leg Trousers',
    slug: 'mudcloth-wide-leg-trousers',
    price: 245,
    categories: ['Bottoms', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'High-waisted wide-leg trousers crafted from Malian Bogolan (mudcloth) fabric. Each pair features unique hand-painted geometric symbols — no two are identical. Heritage meets high fashion.',
    imageUrls: [px(28375903), px(21849366), px(35120330), px(14786739)],
  },
  {
    id: 'seed-product-8',
    title: 'Ankara Matching Set',
    slug: 'ankara-matching-set',
    price: 295,
    categories: ['Sets', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Co-ord two-piece set: cropped flutter-sleeve top and wide-leg trousers in matching Ankara wax print. A favourite at Afrobeats events from Douala to London. Sold as a set.',
    imageUrls: [px(9969741), px(6192559), px(17273203), px(6192459)],
  },
  // ─── WOMEN'S OUTERWEAR ──────────────────────────────────────────────────
  {
    id: 'seed-product-9',
    title: 'Ankara Bomber Jacket',
    slug: 'ankara-bomber-jacket',
    price: 285,
    categories: ['Outerwear', 'Jackets'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Bold Ankara wax-print bomber jacket with contrast rib cuffs and collar. Each panel is hand-cut from premium Dutch wax fabric sourced directly from West African textile markets. Unisex relaxed fit.',
    imageUrls: [px(16779591), px(33549301), px(5560606), px(31914904)],
  },
  // ─── MEN'S TOPS ──────────────────────────────────────────────────────────
  {
    id: 'seed-product-10',
    title: 'Dashiki Oversized Tee',
    slug: 'dashiki-oversized-tee',
    price: 125,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Relaxed-fit oversized tee with chest panel featuring embroidered Dashiki geometric motifs in terracotta and gold on premium 100% Pima cotton. The everyday cultural staple.',
    imageUrls: [px(6192562), px(6192556), px(3986133), px(8470542)],
  },
  {
    id: 'seed-product-11',
    title: 'Kente Mandarin Shirt',
    slug: 'kente-mandarin-shirt',
    price: 165,
    categories: ['Tops', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Long-sleeve mandarin-collar shirt woven in Kente-inspired geometric jacquard. Gold and black repeating patterns on a structured shirt body. A Ghanaian classic, modernised for the global wardrobe.',
    imageUrls: [px(12716001), px(30929475), px(30929467), px(16910025)],
  },
  {
    id: 'seed-product-12',
    title: 'African Print Knit Shirt',
    slug: 'african-print-knit-shirt',
    price: 140,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Breathable knit polo shirt with an all-over African wax-print pattern. Premium 200gsm piqué knit. Easy to dress up or down — from Lagos beach clubs to Nairobi rooftop bars.',
    imageUrls: [px(6191874), px(6191875), px(6191865), px(6190144)],
  },
  {
    id: 'seed-product-13',
    title: 'Ankara Button-Up Shirt',
    slug: 'ankara-button-up-shirt',
    price: 145,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Short-sleeve relaxed-fit button-up crafted from vibrant Ankara wax-print cotton. Cuban collar, single chest pocket, shell buttons. The go-to shirt of the African creative class.',
    imageUrls: [px(13938345), px(6192456), px(6468424), px(6191992)],
  },
  // ─── MEN'S FORMAL & OUTERWEAR ──────────────────────────────────────────────
  {
    id: 'seed-product-14',
    title: 'Agbada Formal Set',
    slug: 'agbada-formal-set',
    price: 450,
    categories: ['Formal', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Three-piece Nigerian Agbada set: wide-sleeved outer robe, inner tunic, and matching trousers in hand-embroidered damask. The pinnacle of West African formal dressing — for weddings, ceremonies, and power moments.',
    imageUrls: [px(34821105), px(31485660), px(20455702), px(33624748)],
  },
  {
    id: 'seed-product-15',
    title: 'Adire Cargo Jacket',
    slug: 'adire-cargo-jacket',
    price: 345,
    categories: ['Outerwear', 'Jackets'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Technical cargo jacket with six pockets, crafted from Yoruba Adire (tie-dye) cotton. Indigo blue and white patterns achieved through traditional resist-dyeing using cassava paste.',
    imageUrls: [px(27898171), px(18327464), px(30201839), px(33723956)],
  },
  {
    id: 'seed-product-16',
    title: 'Afrofuturist Puffer Vest',
    slug: 'afrofuturist-puffer-vest',
    price: 265,
    categories: ['Outerwear', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Quilted puffer vest with Ankara fabric panelling over the chest and back. Recycled down fill. A collision of Afrofuturist aesthetics and high-performance outerwear design.',
    imageUrls: [px(36243901), px(13308438), px(36607444), px(27844486)],
  },
  {
    id: 'seed-product-17',
    title: 'Batik Oversized Hoodie',
    slug: 'batik-oversized-hoodie',
    price: 195,
    categories: ['Hoodies', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Premium heavyweight 400gsm cotton hoodie with hand-dyed batik detailing on the chest and sleeves. Relaxed drop-shoulder fit, dyed using traditional African-inspired resist techniques.',
    imageUrls: [px(29625972), px(4514767), px(36245748), px(6566502)],
  },
  // ─── LUXURY & UNISEX ─────────────────────────────────────────────────────
  {
    id: 'seed-product-18',
    title: 'Kente Silk Kimono',
    slug: 'kente-silk-kimono',
    price: 395,
    categories: ['Kimonos', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Floor-length kimono woven from pure silk with Kente-inspired gold and black geometric patterns. A statement piece bridging ancestral Ghanaian weaving traditions with contemporary silhouettes.',
    imageUrls: [px(33697674), px(33697675), px(31098073), px(7847256)],
  },
  {
    id: 'seed-product-19',
    title: 'Grand Boubou Robe — Men',
    slug: 'grand-boubou-robe-men',
    price: 485,
    categories: ['Formal', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Sweeping Grand Boubou robe for men in starched ivory embroidered cotton. Wide flowing sleeves, tonal chest embroidery, matching trousers. The crown jewel of Senegalese and Malian formal dress.',
    imageUrls: [px(34214461), px(31884483), px(32184490), px(29553408)],
  },
  {
    id: 'seed-product-20',
    title: 'Ndebele Print Bomber',
    slug: 'ndebele-print-bomber',
    price: 310,
    categories: ['Outerwear', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Oversized bomber jacket featuring South African Ndebele geometric patterns — bold angular shapes in red, yellow, green and white on a black base. A tribute to Ndebele mural art, worn on the streets.',
    imageUrls: [px(34123075), px(36990987), px(36990985), px(36456618)],
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
    process.exit(1);
  }
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('\n❌  SANITY_WRITE_TOKEN is not set.');
    process.exit(1);
  }

  console.log(`\n🌍  BantuWear seed — ${PRODUCTS.length} products → project: ${projectId}\n`);

  for (const p of PRODUCTS) {
    process.stdout.write(`  ⏳  ${p.title} ...`);
    try {
      const assetIds = await Promise.all(
        p.imageUrls.map((url, i) => uploadImage(url, `${p.slug}-${i + 1}.jpg`))
      );

      await client.createOrReplace({
        _id: p.id,
        _type: 'product',
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        price: p.price,
        description: p.description,
        categories: p.categories,
        sizes: p.sizes,
        images: assetIds.map((assetId, i) => ({
          _type: 'image',
          _key: `img-${i}`,
          asset: { _type: 'reference', _ref: assetId },
        })),
      });

      process.stdout.write(`  ✅  (${assetIds.length} images)\n`);
    } catch (err) {
      process.stdout.write(`  ❌\n`);
      console.error(`     ${(err as Error).message}`);
    }
  }

  console.log('\n✨  Done! Run `npm run dev` and visit http://localhost:3000/products\n');
}

seed();
