'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Trash2, Check, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Order } from '@/types/order';
import { useToast } from '@/context/ToastContext';
import { Skeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useDeleteOrder } from '@/hooks/useOrders';

type SortKey = 'id' | 'createdAt' | 'total' | 'status';
type SortDirection = 'asc' | 'desc';

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { addToast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const deleteOrderMutation = useDeleteOrder();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders');
      return data;
    },
    staleTime: 1000 * 60,
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      queryClient.setQueryData(['admin-orders'], (old: Order[] | undefined) => 
        old?.map(order => order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order)
      );
      addToast('Estado del pedido actualizado', 'success');
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      addToast('Error al actualizar el estado', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteOrderMutation.mutateAsync(orderId);
      queryClient.setQueryData(['admin-orders'], (old: Order[] | undefined) => 
        old?.filter(order => order.id !== orderId)
      );
      addToast('Pedido eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error deleting order:', error);
      addToast('Error al eliminar el pedido', 'error');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: string | number | Date = a[sortConfig.key];
    let bValue: string | number | Date = b[sortConfig.key];
    
    if (sortConfig.key === 'createdAt') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    }
    
    if (aValue === bValue) return 0;
    const comparison = aValue > bValue ? 1 : -1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (columnKey: SortKey) => {
    if (sortConfig.key !== columnKey) return <div className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'PAID', label: 'Pagado', color: 'bg-blue-500' },
    { value: 'SHIPPED', label: 'Enviado', color: 'bg-purple-500' },
    { value: 'DELIVERED', label: 'Entregado', color: 'bg-green-500' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-500' },
  ];

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(o => o.value === status);
    return option?.label || status;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 flex gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-6 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 text-gray-500 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {isFetching ? 'Actualizando...' : 'Actualizar'}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Search className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar por ID o Email..." 
          className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    ID Pedido
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Fecha
                    {renderSortIcon('createdAt')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center gap-1">
                    Total
                    {renderSortIcon('total')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Estado
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                  ${order.total.toLocaleString()}
                </td>
<td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer transition-all ${getStatusColor(order.status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {getStatusLabel(order.status)}
                      <ChevronDown size={12} className={`transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdownId === order.id && (
                      <div className="absolute z-10 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(order.id, option.value)}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${order.status === option.value ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                            {order.status === option.value && <Check size={14} className="ml-auto text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye size={14} />
                        <span>Ver</span>
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deleteOrderMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedOrders.length)} de {sortedOrders.length} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'PAID': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800';
  }
}
