'use client';

import StoryHero from '@/components/features/home/concepts/StoryHero';
import FeaturesSection from '@/components/features/home/FeaturesSection';
import ProductCarousel from '@/components/features/home/ProductCarousel';
import Button from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';

export default function StoryConceptPage() {
  const { data: products = [], isLoading: loading } = useProducts();

  return (
    <div className="space-y-8 pb-12">
      {/* New Hero Concept */}
      <StoryHero />

      {/* Existing Homepage Content */}
      <FeaturesSection />

      {loading ? (
        <div className="py-8 container mx-auto">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <ProductCarousel title="Productos Destacados" products={products} />
      )}

      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-blue-900 to-blue-600 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg my-12">
          <div className="absolute inset-0 opacity-10 bg-[url('/patterns/circuit.svg')]"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-bold mb-4">¿Eres técnico profesional?</h2>
            <p className="text-blue-100 text-lg mb-6">
              Regístrate como técnico y obtén precios especiales, acceso a manuales técnicos y soporte prioritario.
            </p>
            <Button className="bg-white text-blue-900 hover:bg-blue-50 border-none">
              Registrarme como Técnico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
