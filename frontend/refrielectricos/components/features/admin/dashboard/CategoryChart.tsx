'use client';

import { BarChart3, Crown } from 'lucide-react';

interface Category {
  name: string;
  value: number;
  percentage: number;
}

interface CategoryChartProps {
  categories: Category[];
}

const colorPalette = [
  { bg: 'bg-gradient-to-r from-violet-500 to-purple-600', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  { bg: 'bg-gradient-to-r from-blue-500 to-cyan-600', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  { bg: 'bg-gradient-to-r from-emerald-500 to-teal-600', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-gradient-to-r from-amber-500 to-orange-600', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  { bg: 'bg-gradient-to-r from-pink-500 to-rose-600', text: 'text-pink-600 dark:text-pink-400', dot: 'bg-pink-500' },
];

export default function CategoryChart({ categories }: CategoryChartProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <BarChart3 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          No hay datos de categorías
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...categories.map(c => c.value));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <BarChart3 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Top Categorías
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Categorías más vendidas del período
        </p>
      </div>

      {/* Champion Category */}
      {categories[0] && (
        <div className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  {categories[0].name}
                </h4>
                <div className="px-2 py-0.5 bg-amber-500/20 rounded-full">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">#1</span>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-black text-violet-600 dark:text-violet-400">
                  {categories[0].value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  unidades vendidas ({categories[0].percentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div className="p-6 space-y-4">
        {categories.map((category, index) => {
          const color = colorPalette[index % colorPalette.length];
          const widthPercentage = (category.value / maxValue) * 100;

          return (
            <div key={category.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${color.dot}`} />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {category.name}
                  </span>
                  {index === 0 && (
                    <Crown className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-black text-lg ${color.text}`}>
                    {category.value}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({category.percentage}%)
                  </span>
                </div>
              </div>

              <div className="relative h-10 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                <div
                  className={`
                    absolute inset-y-0 left-0 ${color.bg}
                    transition-all duration-1000 ease-out
                    group-hover:brightness-110
                  `}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Value label inside bar */}
                {widthPercentage > 20 && (
                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="text-white font-bold text-sm drop-shadow-md">
                      {category.value} unidades
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Total de categorías activas:
          </span>
          <span className="font-black text-slate-900 dark:text-white text-lg">
            {categories.length}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
