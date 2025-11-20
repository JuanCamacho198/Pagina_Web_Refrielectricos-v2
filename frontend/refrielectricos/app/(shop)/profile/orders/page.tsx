'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import OrdersList from '@/components/features/profile/orders/OrdersList';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/profile/edit" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Volver al perfil
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Pedidos</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Historial de tus compras y estado de envíos
            </p>
          </div>
        </div>
      </div>

      <OrdersList />
    </div>
  );
}
