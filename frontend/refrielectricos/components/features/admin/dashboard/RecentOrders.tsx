'use client';

import Link from 'next/link';
import { Package, ChevronRight, Clock, MapPin } from 'lucide-react';

interface RecentOrdersProps {
  orders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
  }[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  PENDING: { label: 'Pendiente', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', icon: '⏳' },
  PAID: { label: 'Pagado', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', icon: '💳' },
  SHIPPED: { label: 'Enviado', bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400', icon: '📦' },
  DELIVERED: { label: 'Entregado', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', icon: '✅' },
  CANCELLED: { label: 'Cancelado', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', icon: '❌' },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recientes</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Últimas transacciones</p>
          </div>
        </div>
        <Link 
          href="/admin/orders" 
          className="group inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-all duration-200"
        >
          Ver todos
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="h-[280px] flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center font-medium">No hay pedidos recientes</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Los nuevos pedidos aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            return (
              <div 
                key={order.id} 
                className="group flex items-center justify-between p-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl hover:shadow-md hover:shadow-gray-900/5 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-500">
                      <span className="text-2xl">{status.icon}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {order.user.name || order.user.email.split('@')[0]}
                      <span className="text-xs text-gray-400 font-normal">#{order.id.slice(-6).toUpperCase()}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${order.total.toLocaleString()}
                  </p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
