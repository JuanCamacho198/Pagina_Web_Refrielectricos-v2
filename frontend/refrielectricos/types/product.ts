export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  images_url: string[];
  category: string;
  brand: string | null;
  sku: string | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
