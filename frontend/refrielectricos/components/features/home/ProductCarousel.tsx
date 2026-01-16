'use client';

import { useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/features/products/ProductCard';
import { Product } from '@/types/product';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

const SCROLL_AMOUNT = 300; // Ancho aproximado de una tarjeta + gap

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      if (direction === 'left') {
        current.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
      }
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
