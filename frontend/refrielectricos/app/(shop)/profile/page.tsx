'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { Package, Heart, MapPin, User, LogOut, Settings, ChevronRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: orders, isLoading: loadingOrders } = useOrders();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No has iniciado sesión</h2>
        <p className="text-gray-500 mb-8">Inicia sesión para ver tu perfil y gestionar tus pedidos.</p>
        <Link href="/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Mis Pedidos',
      description: 'Rastrea tus compras y ver historial',
      icon: <Package className="w-6 h-6 text-blue-600" />,
      href: '/profile/orders',
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Lista de Deseos',
      description: 'Tus productos favoritos guardados',
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      href: '/profile/wishlists',
      color: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      title: 'Direcciones',
      description: 'Gestiona tus direcciones de envío',
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      href: '/profile/addresses',
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Editar Perfil',
      description: 'Actualiza tus datos personales',
      icon: <User className="w-6 h-6 text-purple-600" />,
      href: '/profile/edit',
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Hola, <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
          </p>
        </div>
        <Button variant="outline" onClick={logout} className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/30 dark:hover:bg-red-900/20">
          <LogOut size={18} className="mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menú Principal */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${item.color} transition-transform group-hover:scale-110 duration-300`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {user.role === 'ADMIN' && (
            <Link 
              href="/admin"
              className="group bg-gray-900 dark:bg-gray-700 p-6 rounded-2xl shadow-sm border border-gray-800 dark:border-gray-600 hover:shadow-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 md:col-span-2"
            >
              <div className="flex items-center justify-center gap-3 text-white">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Ir al Panel de Administración</span>
              </div>
            </Link>
          )}
        </div>

        {/* Resumen de Órdenes Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recientes</h2>
            <Link href="/profile/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Orden #{order.id.slice(-6)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      ${Number(order.total).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No tienes pedidos recientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
