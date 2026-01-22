'use client';

import { Clock, TrendingUp } from 'lucide-react';

interface HourData {
  hour: number;
  hourLabel: string;
  count: number;
  revenue: number;
}

interface SalesHeatmapProps {
  data: HourData[];
}

export default function SalesHeatmap({ data }: SalesHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Clock className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          No hay datos de ventas por hora
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  const getIntensity = (count: number) => {
    if (count === 0) return 'opacity-10';
    const percentage = (count / maxCount) * 100;
    if (percentage >= 80) return 'opacity-100';
    if (percentage >= 60) return 'opacity-75';
    if (percentage >= 40) return 'opacity-50';
    if (percentage >= 20) return 'opacity-30';
    return 'opacity-20';
  };

  const getSize = (count: number) => {
    if (count === 0) return 'scale-50';
    const percentage = (count / maxCount) * 100;
    if (percentage >= 80) return 'scale-110';
    if (percentage >= 60) return 'scale-100';
    if (percentage >= 40) return 'scale-90';
    if (percentage >= 20) return 'scale-75';
    return 'scale-60';
  };

  const peakHour = data.reduce((prev, current) => 
    current.count > prev.count ? current : prev
  );

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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Mapa de Calor de Ventas
            </h3>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Distribución de ventas a lo largo del día
        </p>
      </div>

      {/* Peak Hour Banner */}
      <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Hora pico: {peakHour.hourLabel}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {peakHour.count} ventas • {formatCurrency(peakHour.revenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-2">
          {data.map((hour) => (
            <div
              key={hour.hour}
              className="group relative"
            >
              {/* Hour Cell */}
              <div
                className={`
                  aspect-square rounded-lg transition-all duration-300
                  ${getIntensity(hour.count)}
                  ${getSize(hour.count)}
                  ${hour.count > 0 
                    ? 'bg-linear-to-br from-purple-500 to-pink-500 hover:scale-125 cursor-pointer' 
                    : 'bg-slate-200 dark:bg-slate-800'
                  }
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`
                    text-[10px] font-bold
                    ${hour.count > 0 ? 'text-white' : 'text-slate-400 dark:text-slate-600'}
                  `}>
                    {hour.hour}
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              {hour.count > 0 && (
                <div className="
                  absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  w-max
                ">
                  <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg p-3 shadow-xl border-2 border-purple-500">
                    <div className="text-xs font-mono font-bold mb-1">{hour.hourLabel}</div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="opacity-75">Ventas:</span>
                        <span className="font-bold">{hour.count}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="opacity-75">Ingresos:</span>
                        <span className="font-bold">{formatCurrency(hour.revenue)}</span>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-mono">00:00</span>
            <div className="flex items-center gap-1">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="w-6 h-6 rounded bg-linear-to-br from-purple-500 to-pink-500"
                  style={{ opacity: percent / 100 }}
                />
              ))}
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-mono">23:00</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-mono">
            Menos <span className="mx-2">→</span> Más
          </div>
        </div>
      </div>
    </div>
  );
}
