export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  sku: string | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
