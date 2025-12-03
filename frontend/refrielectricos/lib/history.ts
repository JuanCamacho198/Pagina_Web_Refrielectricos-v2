import api from './api';
import { Product } from '@/types/product';

export interface ProductView {
  id: string;
  product: Product;
  viewedAt: string;
}

export const historyService = {
  recordView: async (productId: string) => {
    const response = await api.post(`/products/${productId}/view`);
    return response.data;
  },

  getHistory: async (): Promise<ProductView[]> => {
    const response = await api.get('/users/history');
    return response.data;
  },
};
