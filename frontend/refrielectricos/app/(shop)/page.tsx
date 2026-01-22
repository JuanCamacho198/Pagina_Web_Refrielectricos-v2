import { serverApi } from '@/lib/server-api';
import { Product } from '@/types/product';
import HeroCarousel from '@/components/features/home/HeroCarousel';
import FeaturesSection from '@/components/features/home/FeaturesSection';
import BrandsCarousel from '@/components/features/home/BrandsCarousel';
import ProductCarousel from '@/components/features/home/ProductCarousel';
import Button from '@/components/ui/Button';
import { Mail } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  buttonText: string | null;
  isActive: boolean;
  position: number;
}

interface StoreSettings {
  feature1Title: string;
  feature1Description: string;
  feature1Icon: string;
  feature1Enabled: boolean;
  feature2Title: string;
  feature2Description: string;
  feature2Icon: string;
  feature2Enabled: boolean;
  feature3Title: string;
  feature3Description: string;
  feature3Icon: string;
  feature3Enabled: boolean;
  feature4Title: string;
  feature4Description: string;
  feature4Icon: string;
  feature4Enabled: boolean;
}

// Newsletter section hoisted
const NewsletterSection = () => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700">
    <div className="max-w-2xl mx-auto">
      <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-6">
        <Mail size={24} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Suscríbete a nuestro boletín
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Recibe las últimas novedades, ofertas exclusivas y consejos de mantenimiento directamente en tu correo.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Tu correo electrónico" 
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <Button type="submit">Suscribirse</Button>
      </form>
    </div>
  </div>
);

// Función para obtener productos (Server Side)
async function getProducts(): Promise<Product[]> {
  try {
    const data = await serverApi.get<{ data: Product[] }>('/products?limit=50');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    // console.error('Failed to fetch products', error);
    return [];
  }
}

// Función para obtener banners (Server Side)
async function getBanners(): Promise<Banner[]> {
  try {
    const data = await serverApi.get<Banner[]>('/banners?activeOnly=true');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // console.error('Failed to fetch banners', error);
    return [];
  }
}

// Función para obtener settings (Server Side)
async function getSettings(): Promise<StoreSettings | null> {
  try {
    return await serverApi.get<StoreSettings>('/settings');
  } catch (error) {
    // console.error('Failed to fetch settings', error);
    return null;
  }
}

// Forzar renderizado dinámico porque usamos cookies
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, banners, settings] = await Promise.all([
    getProducts(),
    getBanners(),
    getSettings(),
  ]);

  // Filtrar productos por categoría
  const lightingProducts = products.filter(p => 
    p.category?.toLowerCase().includes('iluminación') || 
    p.category?.toLowerCase().includes('iluminacion')
  );
  
  const electricalProducts = products.filter(p => 
    p.category?.toLowerCase().includes('eléctricos') || 
    p.category?.toLowerCase().includes('electricos') ||
    p.category?.toLowerCase().includes('electricidad')
  );

  const features = [
    {
      title: settings?.feature1Title || 'Envío Gratis',
      description: settings?.feature1Description || 'En pedidos superiores a $300.000',
      icon: settings?.feature1Icon || 'Truck',
      enabled: settings?.feature1Enabled ?? true,
    },
    {
      title: settings?.feature2Title || 'Garantía Asegurada',
      description: settings?.feature2Description || 'Productos 100% originales y garantizados',
      icon: settings?.feature2Icon || 'ShieldCheck',
      enabled: settings?.feature2Enabled ?? true,
    },
    {
      title: settings?.feature3Title || 'Soporte Técnico',
      description: settings?.feature3Description || 'Asesoría experta para tus compras',
      icon: settings?.feature3Icon || 'Headphones',
      enabled: settings?.feature3Enabled ?? true,
    },
    {
      title: settings?.feature4Title || 'Pago Seguro',
      description: settings?.feature4Description || 'Múltiples métodos de pago confiables',
      icon: settings?.feature4Icon || 'CreditCard',
      enabled: settings?.feature4Enabled ?? true,
    },
  ].filter(f => f.enabled);

  return (
    <div className="space-y-8 pb-12">
      <h1 className="sr-only">Refrielectricos: Repuestos de Refrigeración y Electricidad</h1>
      
      {/* Hero Section */}
      <HeroCarousel banners={banners} />

      {/* Productos Destacados (Carousel) */}
      <ProductCarousel title="Productos Destacados" products={products.slice(0, 12)} />
      
      {/* Carrusel de Marcas */}
      <BrandsCarousel />
      
      {/* Carrusel de Iluminación */}
      {lightingProducts.length > 0 && (
        <ProductCarousel title="Iluminación" products={lightingProducts.slice(0, 12)} />
      )}
      
      {/* Carrusel de Productos Eléctricos */}
      {electricalProducts.length > 0 && (
        <ProductCarousel title="Productos Eléctricos" products={electricalProducts.slice(0, 12)} />
      )}

      {/* Features (Envío gratis, etc) */}
      <FeaturesSection features={features} />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
