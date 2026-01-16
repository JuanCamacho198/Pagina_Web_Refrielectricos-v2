'use client';

import HeroCarousel from '@/components/features/home/HeroCarousel';
import FeaturesSection from '@/components/features/home/FeaturesSection';
import BrandsCarousel from '@/components/features/home/BrandsCarousel';
import ProductCarousel from '@/components/features/home/ProductCarousel';
import Button from '@/components/ui/Button';
import { Mail } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

// Hoisting de JSX estático - no cambia entre renders
const LoadingSkeleton = () => (
  <div className="py-8">
    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />
    <div className="flex gap-6 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="min-w-[280px] h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

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
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
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

export default function Home() {
  const { data: products = [], isLoading: loading } = useProducts();

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

  return (
    <div className="space-y-8 pb-12">
      <h1 className="sr-only">Refrielectricos: Repuestos de Refrigeración y Electricidad</h1>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Carrusel de Marcas */}
      <BrandsCarousel />

      {/* Productos Destacados (Carousel) */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <ProductCarousel title="Productos Destacados" products={products.slice(0, 12)} />
          
          {/* Carrusel de Iluminación */}
          {lightingProducts.length > 0 && (
            <ProductCarousel title="Iluminación" products={lightingProducts.slice(0, 12)} />
          )}
          
          {/* Carrusel de Productos Eléctricos */}
          {electricalProducts.length > 0 && (
            <ProductCarousel title="Productos Eléctricos" products={electricalProducts.slice(0, 12)} />
          )}
        </>
      )}

      {/* Features (Envío gratis, etc) */}
      <FeaturesSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}

