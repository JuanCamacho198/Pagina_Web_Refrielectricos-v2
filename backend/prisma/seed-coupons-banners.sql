-- Insertar cupones de ejemplo
INSERT INTO "Coupon" (id, code, description, "discountType", "discountValue", "minPurchaseAmount", "maxDiscountAmount", "usageLimit", "usageCount", "isActive", "startsAt", "expiresAt", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'VERANO2024', 'Descuento de verano - 20% en toda la tienda', 'PERCENTAGE', 20, 50000, 100000, 100, 0, true, NOW(), NOW() + INTERVAL '30 days', NOW(), NOW()),
  (gen_random_uuid(), 'PRIMERACOMPRA', 'Descuento para nuevos clientes', 'PERCENTAGE', 15, 0, 50000, 50, 0, true, NOW(), NOW() + INTERVAL '90 days', NOW(), NOW()),
  (gen_random_uuid(), 'ENVIOGRATIS', 'Envío gratis desde $100,000', 'FIXED', 15000, 100000, NULL, NULL, 0, true, NULL, NULL, NOW(), NOW());

-- Insertar banners de ejemplo
INSERT INTO "Banner" (id, title, subtitle, "imageUrl", link, "buttonText", "isActive", position, "startsAt", "endsAt", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Repuestos de Refrigeración', 'La mejor calidad para tus reparaciones', '/images/carrusel2.jpg', '/products?category=Refrigeración', 'Ver Productos', true, 1, NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Herramientas Profesionales', 'Equípate con lo mejor', '/images/carrusel1.jpg', '/products?category=Herramientas', 'Ver Productos', true, 2, NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Ofertas Especiales', 'Precios increíbles por tiempo limitado', '/images/carrusel3.jpg', '/products', 'Ver Ofertas', true, 3, NULL, NULL, NOW(), NOW());
