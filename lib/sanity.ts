import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-25',
  useCdn: false,
});

export const productsQuery = `*[_type == "product"] | order(_createdAt asc) {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  sizes,
  categories,
  "images": images[].asset->url
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  description,
  sizes,
  categories,
  "images": images[].asset->url,
  "model_3d_url": model3D.asset->url
}`;

export const recommendedProductsQuery = `*[_type == "product" && _id != $productId && count(categories[@ in $categories]) > 0][0...4] {
  "id": _id,
  "name": title,
  "slug": slug.current,
  price,
  "images": images[].asset->url,
  categories
}`;

export const userByEmailQuery = `*[_type == "user" && email == $email][0] {
  "_id": _id,
  email,
  passwordHash,
  role
}`;
