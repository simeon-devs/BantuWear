import type { SanityProduct } from '@/types/sanity';

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const FALLBACK_PRODUCTS: SanityProduct[] = [
  // ─── WOMEN'S DRESSES ────────────────────────────────────────────────────────
  {
    id: 'seed-product-1',
    name: 'Kanga Wrap Dress',
    slug: 'kanga-wrap-dress',
    price: 220,
    categories: ['Dresses', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Midi wrap dress crafted from East African Kanga fabric featuring vibrant printed motifs and a Swahili proverb border. Adjustable tie waist. Ethically produced in Nairobi, Kenya.',
    images: [px(10698019), px(20370167), px(2331507), px(17273207)],
  },
  {
    id: 'seed-product-2',
    name: 'Ankara Corset Dress',
    slug: 'ankara-corset-dress',
    price: 265,
    categories: ['Dresses', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Structured corset midi dress cut from premium Dutch wax Ankara print. Boned bodice, flared midi skirt. Makes a statement at any occasion — from Lagos rooftops to Accra galleries.',
    images: [px(6937912), px(7745487), px(34747815), px(18853893)],
  },
  {
    id: 'seed-product-3',
    name: 'Grand Boubou Kaftan',
    slug: 'grand-boubou-kaftan',
    price: 320,
    categories: ['Dresses', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Floor-length Grand Boubou kaftan in breathable embroidered cotton voile. A West African heritage silhouette modernised with clean lines and tonal embroidery at the collar and cuffs. Ships from Dakar.',
    images: [px(17273216), px(17273215), px(17273201), px(7465554)],
  },
  {
    id: 'seed-product-4',
    name: 'Dashiki Maxi Dress',
    slug: 'dashiki-maxi-dress',
    price: 175,
    categories: ['Dresses', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Relaxed floor-length maxi dress with an oversized Dashiki chest panel in terracotta and gold on jet-black 100% Pima cotton. Equal parts heritage and effortless everyday wear.',
    images: [px(12477588), px(7702284), px(6192596), px(943469)],
  },
  {
    id: 'seed-product-5',
    name: 'Adire Smocked Romper',
    slug: 'adire-smocked-romper',
    price: 155,
    categories: ['Dresses', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Playful smocked romper hand-dyed with Yoruba Adire resist technique. Each piece features a unique indigo and sky-blue pattern — no two are identical. Wide-leg cut, elastic waist.',
    images: [px(2703042), px(17192447), px(6192459), px(5569069)],
  },

  // ─── WOMEN'S TOPS & BOTTOMS ──────────────────────────────────────────────────
  {
    id: 'seed-product-6',
    name: 'Ankara Wide-Leg Trousers',
    slug: 'ankara-wide-leg-trousers',
    price: 185,
    categories: ['Bottoms', 'Streetwear'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'High-waisted wide-leg trousers cut from bold Ankara wax-print fabric. Tailored yet relaxed — pair with a fitted crop or let the print speak solo. A staple of contemporary West African street style.',
    images: [px(4617654), px(11552980), px(5569069), px(3973748)],
  },
  {
    id: 'seed-product-7',
    name: 'Mudcloth Wide-Leg Trousers',
    slug: 'mudcloth-wide-leg-trousers',
    price: 245,
    categories: ['Bottoms', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'High-waisted wide-leg trousers crafted from Malian Bogolan (mudcloth) fabric. Each pair features unique hand-painted geometric symbols — no two are identical. Heritage meets high fashion.',
    images: [px(28375903), px(21849366), px(35120330), px(14786739)],
  },
  {
    id: 'seed-product-8',
    name: 'Ankara Matching Set',
    slug: 'ankara-matching-set',
    price: 295,
    categories: ['Sets', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Co-ord two-piece set: cropped flutter-sleeve top and wide-leg trousers in matching Ankara wax print. A favourite at Afrobeats events from Douala to London. Sold as a set.',
    images: [px(9969741), px(6192559), px(17273203), px(6192459)],
  },

  // ─── WOMEN'S OUTERWEAR ────────────────────────────────────────────────────────
  {
    id: 'seed-product-9',
    name: 'Ankara Bomber Jacket',
    slug: 'ankara-bomber-jacket',
    price: 285,
    categories: ['Outerwear', 'Jackets'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Bold Ankara wax-print bomber jacket with contrast rib cuffs and collar. Each panel is hand-cut from premium Dutch wax fabric sourced directly from West African textile markets. Unisex relaxed fit.',
    images: [px(16779591), px(33549301), px(5560606), px(31914904)],
  },

  // ─── MEN'S TOPS ──────────────────────────────────────────────────────────────
  {
    id: 'seed-product-10',
    name: 'Dashiki Oversized Tee',
    slug: 'dashiki-oversized-tee',
    price: 125,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Relaxed-fit oversized tee with chest panel featuring embroidered Dashiki geometric motifs in terracotta and gold on premium 100% Pima cotton. The everyday cultural staple.',
    images: [px(6192562), px(6192556), px(3986133), px(8470542)],
  },
  {
    id: 'seed-product-11',
    name: 'Kente Mandarin Shirt',
    slug: 'kente-mandarin-shirt',
    price: 165,
    categories: ['Tops', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Long-sleeve mandarin-collar shirt woven in Kente-inspired geometric jacquard. Gold and black repeating patterns on a structure shirt body. A Ghanaian classic, modernised for the global wardrobe.',
    images: [px(12716001), px(30929475), px(30929467), px(16910025)],
  },
  {
    id: 'seed-product-12',
    name: 'African Print Knit Shirt',
    slug: 'african-print-knit-shirt',
    price: 140,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Breathable knit polo shirt with an all-over African wax-print pattern. Premium 200gsm piqué knit. Easy to dress up or down — from Lagos beach clubs to Nairobi rooftop bars.',
    images: [px(6191874), px(6191875), px(6191865), px(6190144)],
  },
  {
    id: 'seed-product-13',
    name: 'Ankara Button-Up Shirt',
    slug: 'ankara-button-up-shirt',
    price: 145,
    categories: ['Tops', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Short-sleeve relaxed-fit button-up crafted from vibrant Ankara wax-print cotton. Cuban collar, single chest pocket, shell buttons. The go-to shirt of the African creative class.',
    images: [px(13938345), px(6192456), px(6468424), px(6191992)],
  },

  // ─── MEN'S FORMAL & OUTERWEAR ────────────────────────────────────────────────
  {
    id: 'seed-product-14',
    name: 'Agbada Formal Set',
    slug: 'agbada-formal-set',
    price: 450,
    categories: ['Formal', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Three-piece Nigerian Agbada set: wide-sleeved outer robe, inner tunic, and matching trousers in hand-embroidered damask. The pinnacle of West African formal dressing — for weddings, ceremonies, and power moments.',
    images: [px(34821105), px(31485660), px(20455702), px(33624748)],
  },
  {
    id: 'seed-product-15',
    name: 'Adire Cargo Jacket',
    slug: 'adire-cargo-jacket',
    price: 345,
    categories: ['Outerwear', 'Jackets'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Technical cargo jacket with six pockets, crafted from Yoruba Adire (tie-dye) cotton. Indigo blue and white patterns achieved through traditional resist-dyeing using cassava paste.',
    images: [px(27898171), px(18327464), px(30201839), px(33723956)],
  },
  {
    id: 'seed-product-16',
    name: 'Afrofuturist Puffer Vest',
    slug: 'afrofuturist-puffer-vest',
    price: 265,
    categories: ['Outerwear', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Quilted puffer vest with Ankara fabric panelling over the chest and back. Recycled down fill. A collision of Afrofuturist aesthetics and high-performance outerwear design.',
    images: [px(36243901), px(13308438), px(36607444), px(27844486)],
  },
  {
    id: 'seed-product-17',
    name: 'Batik Oversized Hoodie',
    slug: 'batik-oversized-hoodie',
    price: 195,
    categories: ['Hoodies', 'Streetwear'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Premium heavyweight 400gsm cotton hoodie with hand-dyed batik detailing on the chest and sleeves. Relaxed drop-shoulder fit, dyed using traditional African-inspired resist techniques.',
    images: [px(29625972), px(4514767), px(36245748), px(6566502)],
  },

  // ─── LUXURY & UNISEX ─────────────────────────────────────────────────────────
  {
    id: 'seed-product-18',
    name: 'Kente Silk Kimono',
    slug: 'kente-silk-kimono',
    price: 395,
    categories: ['Kimonos', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Floor-length kimono woven from pure silk with Kente-inspired gold and black geometric patterns. A statement piece bridging ancestral Ghanaian weaving traditions with contemporary silhouettes.',
    images: [px(33697674), px(33697675), px(31098073), px(7847256)],
  },
  {
    id: 'seed-product-19',
    name: 'Grand Boubou Robe — Men',
    slug: 'grand-boubou-robe-men',
    price: 485,
    categories: ['Formal', 'Luxury'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Sweeping Grand Boubou robe for men in starched white or ivory embroidered cotton. Wide flowing sleeves, tonal chest embroidery, matching trousers. The crown jewel of Senegalese and Malian formal dress.',
    images: [px(34214461), px(31884483), px(32184490), px(29553408)],
  },
  {
    id: 'seed-product-20',
    name: 'Ndebele Print Bomber',
    slug: 'ndebele-print-bomber',
    price: 310,
    categories: ['Outerwear', 'Luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Oversized bomber jacket featuring South African Ndebele geometric patterns — bold angular shapes in red, yellow, green and white on a black base. A tribute to Ndebele mural art, worn on the streets.',
    images: [px(34123075), px(36990987), px(36990985), px(36456618)],
  },

  // ─── CAMEROONIAN COLLECTION ──────────────────────────────────────────────────
  {
    id: 'seed-product-21',
    name: 'Ndop Ceremonial Robe',
    slug: 'ndop-ceremonial-robe',
    price: 420,
    categories: ['Luxury', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Hand-woven Ndop cloth of the Grassfields (Bamenda, Kom region) — indigo-dyed cotton with white resist-print symbolic motifs. Worn by royalty and at ceremonies, each pattern carries ancestral meaning. One of Cameroon\'s most sacred textiles.',
    images: [px(19619009), px(34558680), px(35118000), px(35197097)],
  },
  {
    id: 'seed-product-22',
    name: 'Toghu Royal Ensemble',
    slug: 'toghu-royal-ensemble',
    price: 550,
    categories: ['Formal', 'Luxury', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Iconic Toghu (Atoghu) regalia from the North-West Grassfields of Cameroon. Jet-black base fabric richly embroidered with multicolour motifs in red, yellow and green — the dress code of Cameroonian royalty, chiefs, and dignitaries. Worn at funerals, coronations, and national celebrations.',
    images: [px(12241238), px(33687331), px(34037181), px(12241227)],
  },
  {
    id: 'seed-product-23',
    name: 'Kaba Ngondo Gown',
    slug: 'kaba-ngondo-gown',
    price: 245,
    categories: ['Dresses', 'Cameroonian'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description:
      'Flowing Kaba gown worn by Sawa coastal women of Douala and the Littoral region. Loose, graceful silhouette in vibrant wax-print cotton — traditionally worn during the Ngondo water festival and coastal ceremonies. A symbol of Cameroonian coastal femininity.',
    images: [px(36492506), px(33245723), px(33609158), px(34205451)],
  },
  {
    id: 'seed-product-24',
    name: 'Sanja Wrap — Coastal Men',
    slug: 'sanja-wrap-coastal-men',
    price: 125,
    categories: ['Bottoms', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Traditional Sanja wrapper worn by coastal and South-West Cameroonian men. Draped around the waist and paired with a crisp white shirt and cap for ceremonies and celebrations. A staple of Bakweri and Sawa male dress.',
    images: [px(31602730), px(33709998), px(33466533), px(30651375)],
  },
  {
    id: 'seed-product-25',
    name: 'Pagne Wrapper Skirt',
    slug: 'pagne-wrapper-skirt',
    price: 95,
    categories: ['Bottoms', 'Cameroonian'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Versatile rectangular Pagne cloth worn as a wrap skirt across all regions of Cameroon. Vibrant printed cotton in bold patterns — tied at the waist for daily wear, markets, and ceremonies alike. The most universally worn garment across Cameroonian tribes.',
    images: [px(34123056), px(17273210), px(8655018), px(35633192)],
  },
  {
    id: 'seed-product-26',
    name: 'Boubou Auada — North Cameroon',
    slug: 'boubou-auada-north-cameroon',
    price: 385,
    categories: ['Formal', 'Luxury', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Wide, flowing three-piece Boubou (locally called Auada) worn by Fulani and Hausa men of northern Cameroon and the Far North. Outer robe, inner tunic, and loose trousers in embroidered damask or bazin riche. Commanding, dignified, unmistakable.',
    images: [px(8526816), px(36029407), px(32730625), px(30412220)],
  },
  {
    id: 'seed-product-27',
    name: 'Gandoura Robe',
    slug: 'gandoura-robe',
    price: 210,
    categories: ['Tops', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Long, loose Gandoura tunic worn by men across northern Cameroon and the Sahel belt. Lightweight cotton or bazin fabric in white, cream, or muted tones — cool in the Sahelian heat and elegant at any gathering. Paired with sandals and a kufi cap.',
    images: [px(32466465), px(35701846), px(14045669), px(34740994)],
  },
  {
    id: 'seed-product-28',
    name: 'Abom Raffia Ceremonial Outfit',
    slug: 'abom-raffia-ceremonial-outfit',
    price: 480,
    categories: ['Formal', 'Luxury', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Traditional Abom (Obom) regalia made from raffia palm fibres and natural bark cloth, worn by Ewondo, Beti, and Bulu peoples of central and southern Cameroon. Deeply ceremonial — worn at initiations, ancestor rites, and forest festivals. A living connection to the Central African rainforest.',
    images: [px(27291185), px(27291174), px(27433139), px(32409589)],
  },
  {
    id: 'seed-product-29',
    name: 'Boo-Boo Flared Gown',
    slug: 'boo-boo-flared-gown',
    price: 195,
    categories: ['Dresses', 'Cameroonian'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    description:
      'Long, flared ankle-length Boo-Boo gown worn by women of northern and Far North Cameroon. Lightweight fabric, easy silhouette, vibrant prints — worn daily and for festive occasions among Fulani, Kotoko, and Arab Choa communities. Effortlessly graceful.',
    images: [px(34735501), px(36478310), px(34752670), px(36796646)],
  },
  {
    id: 'seed-product-30',
    name: 'Gant Prestige Cloth',
    slug: 'gant-prestige-cloth',
    price: 340,
    categories: ['Formal', 'Luxury', 'Cameroonian'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description:
      'Rich Gant fabric — a heavy, lustrous prestige cloth worn by both men and women across West and Central Africa for coronations, funerals, and high ceremonies. In Cameroon, Gant signals status, achievement, and cultural pride. Draped or tailored into a robe, it commands any room.',
    images: [px(37415998), px(36690234), px(36780146), px(34329967)],
  },
];
