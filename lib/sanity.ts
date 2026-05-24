import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-sanity-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-25', // Next-sanity standard api version
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for fast responses
});

/**
 * Standard GROQ Queries mapped to BantuWear structure
 */

// Retrieve all products for the Product List Page (PLP)
export const productsQuery = `*[_type == "product"] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  "images": images[].asset->url,
  categories
}`;

// Retrieve a single product for the Product Detail Page (PDP)
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  "images": images[].asset->url,
  "model_3d_url": model3D.asset->url,
  categories
}`;

// Retrieve dynamic recommended products excluding current ID and having matching categories
export const recommendedProductsQuery = `*[_type == "product" && _id != $productId && count(categories[@ in $categories]) > 0][0...4] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  "images": images[].asset->url,
  categories
}`;

export const userByEmailQuery = `*[_type == "user" && email == $email][0] {
  "_id": _id,
  email,
  passwordHash,
  role
}`;
