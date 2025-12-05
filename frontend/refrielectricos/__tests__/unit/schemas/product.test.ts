/// <reference types="@types/jest" />
import { productSchema, specificationSchema } from '../../../schemas/product';

describe('Product Schemas', () => {
  describe('specificationSchema', () => {
    it('should validate a correct specification', () => {
      const validSpec = {
        label: 'Voltaje',
        value: '220V',
      };
      
      const result = specificationSchema.safeParse(validSpec);
      expect(result.success).toBe(true);
    });

    it('should reject empty label', () => {
      const invalidSpec = {
        label: '',
        value: '220V',
      };
      
      const result = specificationSchema.safeParse(invalidSpec);
      expect(result.success).toBe(false);
    });

    it('should reject empty value', () => {
      const invalidSpec = {
        label: 'Voltaje',
        value: '',
      };
      
      const result = specificationSchema.safeParse(invalidSpec);
      expect(result.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    const validProduct = {
      name: 'Aire Acondicionado Samsung 12000 BTU',
      description: 'Aire acondicionado inverter de alta eficiencia',
      price: 1500000,
      originalPrice: 1800000,
      stock: 10,
      category: 'Aires Acondicionados',
      subcategory: 'Split',
      brand: 'Samsung',
      sku: 'SAM-AC-12000',
      isActive: true,
    };

    it('should validate a complete valid product', () => {
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should validate product with minimal required fields', () => {
      const minimalProduct = {
        name: 'Producto básico',
        price: 100000,
        stock: 5,
      };
      
      const result = productSchema.safeParse(minimalProduct);
      expect(result.success).toBe(true);
    });

    it('should reject short name (less than 3 chars)', () => {
      const invalidProduct = {
        ...validProduct,
        name: 'AB',
      };
      
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
        expect(result.error.issues[0].message).toContain('3 caracteres');
      }
    });

    it('should reject negative price', () => {
      const invalidProduct = {
        ...validProduct,
        price: -100,
      };
      
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('price');
      }
    });

    it('should accept price of 0 (free product)', () => {
      const freeProduct = {
        ...validProduct,
        price: 0,
      };
      
      const result = productSchema.safeParse(freeProduct);
      expect(result.success).toBe(true);
    });

    it('should reject negative stock', () => {
      const invalidProduct = {
        ...validProduct,
        stock: -5,
      };
      
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('stock');
      }
    });

    it('should accept stock of 0 (out of stock)', () => {
      const outOfStockProduct = {
        ...validProduct,
        stock: 0,
      };
      
      const result = productSchema.safeParse(outOfStockProduct);
      expect(result.success).toBe(true);
    });

    it('should reject non-integer stock', () => {
      const invalidProduct = {
        ...validProduct,
        stock: 5.5,
      };
      
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject negative original price', () => {
      const invalidProduct = {
        ...validProduct,
        originalPrice: -100,
      };
      
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should validate product with image URL', () => {
      const productWithImage = {
        ...validProduct,
        image_url: 'https://res.cloudinary.com/example/image.jpg',
      };
      
      const result = productSchema.safeParse(productWithImage);
      expect(result.success).toBe(true);
    });

    it('should reject non-https image URL', () => {
      const productWithHttpImage = {
        ...validProduct,
        image_url: 'http://example.com/image.jpg',
      };
      
      const result = productSchema.safeParse(productWithHttpImage);
      expect(result.success).toBe(false);
    });

    it('should accept empty string for image_url', () => {
      const productWithEmptyImage = {
        ...validProduct,
        image_url: '',
      };
      
      const result = productSchema.safeParse(productWithEmptyImage);
      expect(result.success).toBe(true);
    });

    it('should validate product with specifications array', () => {
      const productWithSpecs = {
        ...validProduct,
        specifications: [
          { label: 'Voltaje', value: '220V' },
          { label: 'BTU', value: '12000' },
          { label: 'Tipo', value: 'Inverter' },
        ],
      };
      
      const result = productSchema.safeParse(productWithSpecs);
      expect(result.success).toBe(true);
    });

    it('should validate product with tags array', () => {
      const productWithTags = {
        ...validProduct,
        tags: ['oferta', 'nuevo', 'inverter'],
      };
      
      const result = productSchema.safeParse(productWithTags);
      expect(result.success).toBe(true);
    });

    it('should coerce string numbers to numbers', () => {
      const productWithStringNumbers = {
        name: 'Producto',
        price: '150000' as unknown as number,
        stock: '10' as unknown as number,
      };
      
      const result = productSchema.safeParse(productWithStringNumbers);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.price).toBe('number');
        expect(typeof result.data.stock).toBe('number');
      }
    });
  });
});
