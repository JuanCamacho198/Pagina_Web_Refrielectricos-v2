'use client';

import { TrendingUp, Package, Flame, Zap, Award } from 'lucide-react';

interface TopProductsProps {
  products: {
    id: string;
    name: string;
    sold: number;
  }[];
}

const RANK_COLORS = [
  { bg: 'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-500/20 dark:to-amber-500/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-500/50', icon: Award, glow: 'shadow-amber-500/30' },
  { bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600/40 dark:to-gray-700/50', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-500', icon: Zap, glow: 'shadow-gray-500/30' },
  { bg: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-500/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-500/50', icon: Flame, glow: 'shadow-orange-500/30' },
];

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-linear-to-br from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-xl">
          <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Productos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Más vendidos esta semana</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="h-[280px] flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center font-medium">No hay productos vendidos aún</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Los productos aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => {
            const rankConfig = RANK_COLORS[index] || { 
              bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/20', 
              text: 'text-blue-700 dark:text-blue-400',
              border: 'border-blue-200 dark:border-blue-500/30',
              icon: TrendingUp,
              glow: 'shadow-blue-500/20'
            };
            const IconComponent = rankConfig.icon;
            
            return (
              <div 
                key={product.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${rankConfig.bg} ${rankConfig.border} ${rankConfig.glow}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl ${rankConfig.bg} border ${rankConfig.border} shadow-sm`}>
                    {index < 3 ? (
                      <IconComponent className={`h-5 w-5 ${rankConfig.text}`} />
                    ) : (
                      <span className={`text-sm font-bold ${rankConfig.text}`}>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {product.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm ${rankConfig.text}`}>
                    <span className="text-lg font-bold">{product.sold}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">vend.</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
