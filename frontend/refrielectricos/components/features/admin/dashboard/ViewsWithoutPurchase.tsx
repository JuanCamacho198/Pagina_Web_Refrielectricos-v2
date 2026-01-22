'use client';

import { Eye, TrendingUp, ExternalLink, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  views: number;
}

interface ViewsWithoutPurchaseProps {
  products: Product[];
}

export default function ViewsWithoutPurchase({ products }: ViewsWithoutPurchaseProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Eye className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          No hay productos vistos sin comprar
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
            <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Más Vistos, Sin Comprar
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Productos con alto interés pero sin conversión
        </p>
      </div>

      {/* Products List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="shrink-0">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg
                  ${index === 0 ? 'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30' : ''}
                  ${index === 1 ? 'bg-linear-to-br from-slate-300 to-slate-400 text-slate-900 shadow-md' : ''}
                  ${index === 2 ? 'bg-linear-to-br from-amber-700 to-amber-800 text-white shadow-md' : ''}
                  ${index > 2 ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : ''}
                `}>
                  {index + 1}
                </div>
              </div>

              {/* Product Image */}
              <div className="shrink-0 w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative border border-slate-200 dark:border-slate-700">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Views Count */}
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Eye className="h-4 w-4" />
                  <span className="font-black text-lg">{product.views}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  visualizaciones
                </p>
              </div>

              {/* Arrow */}
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-5 w-5 text-slate-400" />
              </div>
            </div>

            {/* Opportunity Badge */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${Math.min((product.views / products[0].views) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
                Oportunidad de optimización
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            Considera optimizar precios, descripciones o promociones para estos productos
          </p>
        </div>
      </div>
    </div>
  );
}
