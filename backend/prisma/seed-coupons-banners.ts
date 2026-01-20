import { config } from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding coupons and banners...');

  // Seed Coupons
  const coupons = await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'VERANO2024' },
      update: {},
      create: {
        code: 'VERANO2024',
        description: 'Descuento de verano - 20% en toda la tienda',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minPurchaseAmount: 50000,
        maxDiscountAmount: 100000,
        usageLimit: 100,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'PRIMERACOMPRA' },
      update: {},
      create: {
        code: 'PRIMERACOMPRA',
        description: 'Descuento para nuevos clientes',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxDiscountAmount: 50000,
        usageLimit: 50,
        isActive: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'ENVIOGRATIS' },
      update: {},
      create: {
        code: 'ENVIOGRATIS',
        description: 'Envío gratis desde $100,000',
        discountType: 'FIXED',
        discountValue: 15000,
        minPurchaseAmount: 100000,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${coupons.length} coupons`);

  // Seed Banners
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Repuestos de Refrigeración',
        subtitle: 'La mejor calidad para tus reparaciones',
        imageUrl: '/images/carrusel2.jpg',
        link: '/products?category=Refrigeración',
        buttonText: 'Ver Productos',
        isActive: true,
        position: 1,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Herramientas Profesionales',
        subtitle: 'Equípate con lo mejor',
        imageUrl: '/images/carrusel1.jpg',
        link: '/products?category=Herramientas',
        buttonText: 'Ver Productos',
        isActive: true,
        position: 2,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Ofertas Especiales',
        subtitle: 'Precios increíbles por tiempo limitado',
        imageUrl: '/images/carrusel3.jpg',
        link: '/products',
        buttonText: 'Ver Ofertas',
        isActive: true,
        position: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${banners.length} banners`);
  console.log('🎉 Seeding completed!');
}

void main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
