/// <reference types="@types/jest" />
import { useCartStore, CartItem } from '../../../store/cartStore';
import { Product } from '../../../types/product';
import { act } from '@testing-library/react';

// Mock product for testing
const mockProduct: Product = {
  id: 'prod-1',
  name: 'Aire Acondicionado Samsung',
  slug: 'aire-acondicionado-samsung',
  description: 'Aire acondicionado de alta eficiencia',
  price: 1500000,
  originalPrice: null,
  promoLabel: null,
  stock: 10,
  image_url: 'https://example.com/image.jpg',
  images_url: ['https://example.com/image.jpg'],
  category: 'Climatización',
  subcategory: 'Aires Acondicionados',
  brand: 'Samsung',
  sku: 'AC-SAM-001',
  tags: ['aire', 'climatización'],
  specifications: null,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Nevera LG',
  slug: 'nevera-lg',
  description: 'Nevera de última generación',
  price: 2500000,
  originalPrice: null,
  promoLabel: null,
  stock: 5,
  image_url: 'https://example.com/image2.jpg',
  images_url: ['https://example.com/image2.jpg'],
  category: 'Refrigeración',
  subcategory: 'Neveras',
  brand: 'LG',
  sku: 'NEV-LG-001',
  tags: ['nevera', 'refrigeración'],
  specifications: null,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useCartStore.setState({ items: [], isOpen: false });
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('prod-1');
      expect(items[0].quantity).toBe(1);
      expect(items[0].product.name).toBe('Aire Acondicionado Samsung');
    });

    it('should add item with specified quantity', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 3);
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });

    it('should increment quantity if item already exists', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 2);
        useCartStore.getState().addItem(mockProduct, 3);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it('should add multiple different products', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem(mockProduct2);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem(mockProduct2);
        useCartStore.getState().removeItem('prod-1');
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('prod-2');
    });

    it('should do nothing if item does not exist', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().removeItem('non-existent');
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().updateQuantity('prod-1', 5);
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it('should not affect other items when updating quantity', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 2);
        useCartStore.getState().addItem(mockProduct2, 3);
        useCartStore.getState().updateQuantity('prod-1', 10);
      });

      const { items } = useCartStore.getState();
      const item1 = items.find((i: CartItem) => i.id === 'prod-1');
      const item2 = items.find((i: CartItem) => i.id === 'prod-2');
      
      expect(item1?.quantity).toBe(10);
      expect(item2?.quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from the cart', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem(mockProduct2);
        useCartStore.getState().clearCart();
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('setItems', () => {
    it('should set cart items directly', () => {
      const newItems: CartItem[] = [
        { id: 'prod-1', quantity: 2, product: mockProduct },
        { id: 'prod-2', quantity: 1, product: mockProduct2 },
      ];

      act(() => {
        useCartStore.getState().setItems(newItems);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
      expect(items).toEqual(newItems);
    });
  });

  describe('toggleCart', () => {
    it('should toggle isOpen state', () => {
      expect(useCartStore.getState().isOpen).toBe(false);

      act(() => {
        useCartStore.getState().toggleCart();
      });
      expect(useCartStore.getState().isOpen).toBe(true);

      act(() => {
        useCartStore.getState().toggleCart();
      });
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('cart calculations', () => {
    it('should calculate total correctly', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 2); // 2 * 1,500,000 = 3,000,000
        useCartStore.getState().addItem(mockProduct2, 1); // 1 * 2,500,000 = 2,500,000
      });

      const { items } = useCartStore.getState();
      const total = items.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0);
      
      expect(total).toBe(5500000); // Total = 5,500,000
    });

    it('should calculate total items count', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 3);
        useCartStore.getState().addItem(mockProduct2, 2);
      });

      const { items } = useCartStore.getState();
      const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      
      expect(totalItems).toBe(5);
    });
  });
});
