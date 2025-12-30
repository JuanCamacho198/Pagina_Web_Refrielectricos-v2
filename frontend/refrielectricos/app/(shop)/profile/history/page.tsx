'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { historyService, ProductView } from '@/lib/history';
import Button from '@/components/ui/Button';
import { Clock, ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Historial de Navegación</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historial de Navegación</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No has visto ningún producto recientemente.</p>
          <Link href="/products">
            <Button>Explorar Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((item) => (
            <Link 
              key={item.id} 
              href={`/products/${item.product.slug || item.product.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Visto el {new Date(item.viewedAt).toLocaleDateString()}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    ${typeof item.product.price === 'number' ? item.product.price.toLocaleString() : '0'}
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2.5 group-hover:translate-x-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
