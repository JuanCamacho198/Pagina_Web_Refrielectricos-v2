import { Product } from './product';

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  name: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}
