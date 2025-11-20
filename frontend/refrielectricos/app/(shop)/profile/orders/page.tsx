'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import OrdersList from '@/components/features/profile/orders/OrdersList';
import Navbar from '@/components/layout/Navbar';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <nav className="mb-6">
            <Link 
              href="/profile" 
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 mr-2 transition-colors">
                <ArrowLeft size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              Volver al perfil
            </Link>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Mis Pedidos
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Gestiona y rastrea el estado de tus compras recientes
                </p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                <Package size={18} />
                <span>Historial completo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OrdersList />
        </div>
      </main>
    </div>
  );
}
