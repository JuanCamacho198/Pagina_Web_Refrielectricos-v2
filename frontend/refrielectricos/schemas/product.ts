import { z } from 'zod';

export const specificationSchema = z.object({
  label: z.string().min(1, 'La etiqueta es requerida'),
  value: z.string().min(1, 'El valor es requerido'),
});

export const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a $0'),
  originalPrice: z.coerce.number().min(0, 'El precio original no puede ser negativo').optional(),
  promoLabel: z.string().optional(),
  stock: z.coerce.number().int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
  image_url: z.string()
    .min(1, 'La imagen principal es requerida')
    .url('URL de imagen inválida')
    .startsWith('https://', 'La URL debe ser segura (https://)'),
  images_url: z.array(z.string().url()).optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.array(specificationSchema).optional(),
  isActive: z.boolean().default(false),
});export type ProductFormData = z.infer<typeof productSchema>;
export type SpecificationFormData = z.infer<typeof specificationSchema>;
