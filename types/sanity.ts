export interface SanityProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sizes?: string[];
  categories?: string[];
  stock?: number;
  images?: string[];
  model_3d_url?: string;
  tags?: string[];
}
