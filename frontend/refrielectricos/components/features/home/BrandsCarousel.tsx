'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface Brand {
  name: string;
  logo: string;
}

const BRANDS: Brand[] = [
  { name: 'Black+Decker', logo: '/brands/blackdecker.png' },
  { name: 'DeWalt', logo: '/brands/dewault.png' },
  { name: 'Gerfor', logo: '/brands/gerfor.png' },
  { name: 'Leviton', logo: '/brands/leviton.png' },
  { name: 'Luminex', logo: '/brands/luminex.png' },
  { name: 'Stanley', logo: '/brands/stanley.png' },
];

// Duplicamos las marcas para crear un efecto de loop infinito (4x para pantallas grandes)
const DUPLICATED_BRANDS = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

// Hoisting de estilos CSS - se define una vez a nivel de módulo
const BRAND_STYLES = `
  @keyframes scroll-brands {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-25%);
    }
  }

  .brands-scroll {
    animation: scroll-brands 30s linear infinite;
    width: max-content;
  }

  .brands-scroll:hover {
    animation-play-state: paused;
  }
`;

// Componente de header hoisted (no cambia en re-renders)
const BrandsHeader = () => (
  <div className="text-center mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Marcas que Trabajamos
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Repuestos originales de las mejores marcas del mercado
    </p>
  </div>
);

export default function BrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandsHeader />

        {/* Contenedor del carrusel con overflow oculto */}
        <div className="relative overflow-hidden">
          {/* Gradientes laterales para efecto de desvanecimiento */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          {/* Carrusel animado con soporte táctil */}
          <div 
            ref={scrollRef}
            className={`flex overflow-x-hidden ${!isPaused ? 'brands-scroll' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {DUPLICATED_BRANDS.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="shrink-0 mx-8 transition-all duration-300 hover:scale-105"
                style={{ width: '160px' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center justify-center h-24 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full h-full pointer-events-none">
                    <Image
                      src={brand.logo}
                      alt={`Logo ${brand.name}`}
                      fill
                      className="object-contain"
                      sizes="160px"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{BRAND_STYLES}</style>
    </section>
  );
}
