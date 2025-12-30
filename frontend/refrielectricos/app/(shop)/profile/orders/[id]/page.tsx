'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Image from 'next/image';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ReviewForm } from '@/components/features/reviews/ReviewForm';

export default function OrderDetailPage() {
  const params = useParams();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductToReview, setSelectedProductToReview] = useState<{ id: string; name: string } | null>(null);

  const { data: order, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${params.id}`);
      return data;
    },
    enabled: !!params.id,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pedido no encontrado</h2>
        <Link href="/profile/orders">
          <Button className="mt-4">Volver a mis pedidos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/profile/orders" className="text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pedido #{order.id.slice(-6).toUpperCase()}
              </h1>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 text-gray-500 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
            {translateStatus(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Package className="text-blue-600" size={20} />
              <h2 className="font-semibold text-gray-900 dark:text-white">Productos</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="h-20 w-20 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-900">
                     {item.product.image_url ? (
                        <Image 
                          src={item.product.image_url} 
                          alt={item.product.name} 
                          fill 
                          className="object-contain p-2" 
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                      )}
                  </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity}</p>
                      <p className="text-blue-600 font-medium mt-2">
                        ${typeof item.price === 'number' ? item.price.toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toLocaleString() : '0'}
                      </p>
                    {order.status === 'DELIVERED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => {
                          setSelectedProductToReview({ id: item.product.id, name: item.product.name });
                          setIsReviewModalOpen(true);
                        }}
                      >
                        Calificar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">Total Pagado</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${typeof order.total === 'number' ? order.total.toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              <h2 className="font-semibold text-gray-900 dark:text-white">Dirección de Envío</h2>
            </div>
            <div className="p-6">
              {order.shippingAddress ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destinatario</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Contacto</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress}</p>
                    <p className="text-gray-600 dark:text-gray-400">{order.shippingCity}, {order.shippingState}</p>
                  </div>
                  {order.shippingNotes && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notas de entrega</p>
                      <p className="italic text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        {order.shippingNotes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Sin información de envío registrada.
                </p>
              )}
            </div>
          </div>

          {/* Payment Info (Placeholder) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <CreditCard className="text-blue-600" size={20} />
              <h2 className="font-semibold text-gray-900 dark:text-white">Pago</h2>
            </div>
            <div className="p-6">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                 Método: <span className="font-medium text-gray-900 dark:text-white">Contra entrega / Transferencia</span>
               </p>
               <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                 Estado: <span className="font-medium text-gray-900 dark:text-white">{translateStatus(order.status)}</span>
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Calificar ${selectedProductToReview?.name}`}
      >
        {selectedProductToReview && (
          <ReviewForm
            productId={selectedProductToReview.id}
            onSuccess={() => setIsReviewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    case 'PAID':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'SHIPPED':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    case 'DELIVERED':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  }
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return map[status] || status;
}
