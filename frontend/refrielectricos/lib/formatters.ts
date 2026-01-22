/**
 * Utility functions for formatting and calculations
 * These are pure functions extracted from the application for testing
 */

// Currency configuration map
const CURRENCY_CONFIG: Record<string, { locale: string; symbol: string }> = {
  COP: { locale: 'es-CO', symbol: '$' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'es-ES', symbol: '€' },
  MXN: { locale: 'es-MX', symbol: '$' },
};

// Price formatting with dynamic currency support
export function formatPrice(price: number, currency: string = 'COP'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.COP;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Simplified price format (no currency symbol, just formatted number)
export function formatPriceSimple(price: number, currency: string = 'COP'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.COP;
  
  return new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate discount percentage
export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0 || currentPrice < 0) return 0;
  if (currentPrice >= originalPrice) return 0;
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
}

// Calculate cart totals
export interface CartItem {
  quantity: number;
  product: {
    price: number;
  };
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

export function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate shipping cost (example: free shipping over threshold)
export function calculateShipping(subtotal: number, threshold: number = 300000): number {
  if (subtotal >= threshold) return 0;
  return 15000; // Fixed shipping cost
}

// Calculate total with shipping
export function calculateTotal(items: CartItem[], shippingThreshold: number = 300000): {
  subtotal: number;
  shipping: number;
  total: number;
} {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal, shippingThreshold);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

// Order status labels
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };
  return colors[status] || 'gray';
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
