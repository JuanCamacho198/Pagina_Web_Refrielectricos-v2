export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice?: number | null;
  promoLabel?: string | null;
  stock: number;
  image_url: string | null;
  images_url: string[];
  category: string;
  subcategory: string | null;
  brand: string | null;
  sku: string | null;
  tags: string[];
  specifications: Specification[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
