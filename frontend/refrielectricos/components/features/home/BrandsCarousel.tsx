'use client';

import Image from 'next/image';

interface Brand {
  name: string;
  logo: string;
}

const EXAMPLE_BRANDS: Brand[] = [
  { name: 'Samsung', logo: '/brands/samsung.png' },
  { name: 'LG', logo: '/brands/lg.png' },
  { name: 'Whirlpool', logo: '/brands/whirlpool.png' },
  { name: 'Electrolux', logo: '/brands/electrolux.png' },
  { name: 'Mabe', logo: '/brands/mabe.png' },
  { name: 'Haceb', logo: '/brands/haceb.png' },
  { name: 'Challenger', logo: '/brands/challenger.png' },
  { name: 'Indurama', logo: '/brands/indurama.png' },
];

export default function BrandsCarousel() {
  // Duplicamos las marcas para crear un efecto de loop infinito
  const brands = [...EXAMPLE_BRANDS, ...EXAMPLE_BRANDS];

  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marcas que Trabajamos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Repuestos originales de las mejores marcas del mercado
          </p>
        </div>

        {/* Contenedor del carrusel con overflow oculto */}
        <div className="relative overflow-hidden">
          {/* Gradientes laterales para efecto de desvanecimiento */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

          {/* Carrusel animado */}
          <div className="flex brands-scroll">
            {brands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 brands-pause"
                style={{ width: '160px' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center justify-center h-24 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  {/* Placeholder para las imágenes - Reemplazar con Image cuando tengas los logos */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Por ahora mostramos el nombre de la marca */}
                    <span className="text-gray-600 dark:text-gray-300 font-bold text-sm text-center">
                      {brand.name}
                    </span>
                    {/* 
                      Cuando agregues las imágenes, reemplaza el span con:
                      <Image
                        src={brand.logo}
                        alt={`Logo ${brand.name}`}
                        fill
                        className="object-contain"
                        sizes="160px"
                      />
                    */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota informativa sobre el tamaño de imagen */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 inline-block">
            📐 <strong>Tamaño recomendado para logos:</strong> 300x150px (PNG con fondo transparente)
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-brands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .brands-scroll {
          animation: scroll-brands 30s linear infinite;
        }

        .brands-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
