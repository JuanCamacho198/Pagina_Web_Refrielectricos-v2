/// <reference types="@types/jest" />
import {
  formatPrice,
  formatPriceSimple,
  calculateDiscountPercentage,
  calculateSubtotal,
  calculateTotalItems,
  calculateShipping,
  calculateTotal,
  getOrderStatusLabel,
  getOrderStatusColor,
  truncateText,
  slugify,
  CartItem,
  OrderStatus,
} from '../../../lib/formatters';

describe('Formatters', () => {
  describe('formatPrice', () => {
    it('should format price with COP currency', () => {
      const result = formatPrice(1500000);
      expect(result).toContain('1.500.000');
      expect(result).toMatch(/\$|COP/);
    });

    it('should format zero correctly', () => {
      const result = formatPrice(0);
      expect(result).toContain('0');
    });

    it('should format large numbers with thousands separators', () => {
      const result = formatPrice(25000000);
      expect(result).toContain('25.000.000');
    });

    it('should handle decimal numbers by rounding', () => {
      const result = formatPrice(1500000.75);
      expect(result).toContain('1.500.001');
    });
  });

  describe('formatPriceSimple', () => {
    it('should format price without currency symbol', () => {
      const result = formatPriceSimple(1500000);
      expect(result).toBe('1.500.000');
    });

    it('should use correct thousands separator for Colombian format', () => {
      const result = formatPriceSimple(1234567);
      expect(result).toBe('1.234.567');
    });
  });

  describe('calculateDiscountPercentage', () => {
    it('should calculate correct discount percentage', () => {
      expect(calculateDiscountPercentage(100000, 80000)).toBe(20);
      expect(calculateDiscountPercentage(200000, 150000)).toBe(25);
      expect(calculateDiscountPercentage(1000000, 700000)).toBe(30);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateDiscountPercentage(0, 100)).toBe(0);
      expect(calculateDiscountPercentage(-100, 50)).toBe(0);
      expect(calculateDiscountPercentage(100, -50)).toBe(0);
    });

    it('should return 0 when current price is higher than original', () => {
      expect(calculateDiscountPercentage(100000, 150000)).toBe(0);
    });

    it('should return 0 when prices are equal', () => {
      expect(calculateDiscountPercentage(100000, 100000)).toBe(0);
    });

    it('should round discount percentage', () => {
      expect(calculateDiscountPercentage(100000, 66666)).toBe(33); // 33.334%
    });
  });
});

describe('Cart Calculations', () => {
  const mockItems: CartItem[] = [
    { quantity: 2, product: { price: 500000 } },
    { quantity: 1, product: { price: 1500000 } },
    { quantity: 3, product: { price: 100000 } },
  ];

  describe('calculateSubtotal', () => {
    it('should calculate correct subtotal', () => {
      const result = calculateSubtotal(mockItems);
      // 2*500000 + 1*1500000 + 3*100000 = 1000000 + 1500000 + 300000 = 2800000
      expect(result).toBe(2800000);
    });

    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should handle single item', () => {
      expect(calculateSubtotal([{ quantity: 1, product: { price: 100000 } }])).toBe(100000);
    });
  });

  describe('calculateTotalItems', () => {
    it('should calculate correct total items count', () => {
      const result = calculateTotalItems(mockItems);
      expect(result).toBe(6); // 2 + 1 + 3
    });

    it('should return 0 for empty cart', () => {
      expect(calculateTotalItems([])).toBe(0);
    });
  });

  describe('calculateShipping', () => {
    it('should return 0 for orders above threshold', () => {
      expect(calculateShipping(350000)).toBe(0);
      expect(calculateShipping(300000)).toBe(0);
    });

    it('should return shipping cost for orders below threshold', () => {
      expect(calculateShipping(200000)).toBe(15000);
      expect(calculateShipping(100000)).toBe(15000);
    });

    it('should use custom threshold', () => {
      expect(calculateShipping(150000, 100000)).toBe(0);
      expect(calculateShipping(80000, 100000)).toBe(15000);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate complete order total', () => {
      const result = calculateTotal(mockItems);
      
      expect(result.subtotal).toBe(2800000);
      expect(result.shipping).toBe(0); // Over threshold
      expect(result.total).toBe(2800000);
    });

    it('should include shipping for small orders', () => {
      const smallItems: CartItem[] = [
        { quantity: 1, product: { price: 100000 } },
      ];
      
      const result = calculateTotal(smallItems);
      
      expect(result.subtotal).toBe(100000);
      expect(result.shipping).toBe(15000);
      expect(result.total).toBe(115000);
    });

    it('should handle empty cart', () => {
      const result = calculateTotal([]);
      
      expect(result.subtotal).toBe(0);
      expect(result.shipping).toBe(15000);
      expect(result.total).toBe(15000);
    });
  });
});

describe('Order Status Helpers', () => {
  describe('getOrderStatusLabel', () => {
    it('should return correct Spanish labels', () => {
      expect(getOrderStatusLabel('PENDING')).toBe('Pendiente');
      expect(getOrderStatusLabel('CONFIRMED')).toBe('Confirmado');
      expect(getOrderStatusLabel('SHIPPED')).toBe('Enviado');
      expect(getOrderStatusLabel('DELIVERED')).toBe('Entregado');
      expect(getOrderStatusLabel('CANCELLED')).toBe('Cancelado');
    });

    it('should return status itself for unknown status', () => {
      expect(getOrderStatusLabel('UNKNOWN' as OrderStatus)).toBe('UNKNOWN');
    });
  });

  describe('getOrderStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getOrderStatusColor('PENDING')).toBe('yellow');
      expect(getOrderStatusColor('CONFIRMED')).toBe('blue');
      expect(getOrderStatusColor('SHIPPED')).toBe('purple');
      expect(getOrderStatusColor('DELIVERED')).toBe('green');
      expect(getOrderStatusColor('CANCELLED')).toBe('red');
    });

    it('should return gray for unknown status', () => {
      expect(getOrderStatusColor('UNKNOWN' as OrderStatus)).toBe('gray');
    });
  });
});

describe('Text Utilities', () => {
  describe('truncateText', () => {
    it('should truncate long text with ellipsis', () => {
      const text = 'This is a very long product name that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very lo...');
    });

    it('should return original text if shorter than max', () => {
      expect(truncateText('Short', 20)).toBe('Short');
    });

    it('should return original text if equal to max', () => {
      expect(truncateText('12345678901234567890', 20)).toBe('12345678901234567890');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces with dashes', () => {
      expect(slugify('Aire Acondicionado')).toBe('aire-acondicionado');
    });

    it('should remove accents', () => {
      expect(slugify('Sofá Eléctrico')).toBe('sofa-electrico');
    });

    it('should remove special characters', () => {
      expect(slugify('Product (Special) #1!')).toBe('product-special-1');
    });

    it('should handle multiple consecutive spaces/dashes', () => {
      expect(slugify('Product   Name')).toBe('product-name');
    });

    it('should remove leading and trailing dashes', () => {
      expect(slugify(' -Product- ')).toBe('product');
    });
  });
});
