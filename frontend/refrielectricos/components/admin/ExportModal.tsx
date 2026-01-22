'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X, Calendar, Filter } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

type ExportType = 'orders' | 'products' | 'users';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ExportType;
  categories?: string[];
  brands?: string[];
}

interface OrderFilters {
  startDate: string;
  endDate: string;
  status: string;
}

interface ProductFilters {
  category: string;
  brand: string;
  isActive: string;
}

interface UserFilters {
  startDate: string;
  endDate: string;
  role: string;
}

const ORDER_STATUSES = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

const USER_ROLES = [
  { value: '', label: 'Todos los roles' },
  { value: 'USER', label: 'Usuario' },
  { value: 'ADMIN', label: 'Administrador' },
];

const ACTIVE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Solo activos' },
  { value: 'false', label: 'Solo inactivos' },
];

export default function ExportModal({
  isOpen,
  onClose,
  type,
  categories = [],
  brands = [],
}: ExportModalProps) {
  const { addToast } = useToast();
  const [format, setFormat] = useState<'excel' | 'csv'>('excel');
  const [loading, setLoading] = useState(false);

  // Order filters
  const [orderFilters, setOrderFilters] = useState<OrderFilters>({
    startDate: '',
    endDate: '',
    status: '',
  });

  // Product filters
  const [productFilters, setProductFilters] = useState<ProductFilters>({
    category: '',
    brand: '',
    isActive: '',
  });

  // User filters
  const [userFilters, setUserFilters] = useState<UserFilters>({
    startDate: '',
    endDate: '',
    role: '',
  });

  const getTitle = () => {
    switch (type) {
      case 'orders':
        return 'Exportar Pedidos';
      case 'products':
        return 'Exportar Productos';
      case 'users':
        return 'Exportar Usuarios';
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('format', format);

      if (type === 'orders') {
        if (orderFilters.startDate) params.append('startDate', orderFilters.startDate);
        if (orderFilters.endDate) params.append('endDate', orderFilters.endDate);
        if (orderFilters.status) params.append('status', orderFilters.status);
      } else if (type === 'products') {
        if (productFilters.category) params.append('category', productFilters.category);
        if (productFilters.brand) params.append('brand', productFilters.brand);
        if (productFilters.isActive) params.append('isActive', productFilters.isActive);
      } else if (type === 'users') {
        if (userFilters.startDate) params.append('startDate', userFilters.startDate);
        if (userFilters.endDate) params.append('endDate', userFilters.endDate);
        if (userFilters.role) params.append('role', userFilters.role);
      }

      const response = await api.get(`/exports/${type}?${params.toString()}`, {
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const dateStr = new Date().toISOString().split('T')[0];
      const typeNames = { orders: 'pedidos', products: 'productos', users: 'usuarios' };
      link.download = `${typeNames[type]}_${dateStr}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast('Archivo exportado correctamente', 'success');
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      addToast('Error al exportar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setOrderFilters({ startDate: '', endDate: '', status: '' });
    setProductFilters({ category: '', brand: '', isActive: '' });
    setUserFilters({ startDate: '', endDate: '', role: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Formato de exportación
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormat('excel')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                format === 'excel'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FileSpreadsheet size={24} />
              <div className="text-left">
                <p className="font-medium">Excel (.xlsx)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Con formato y estilos</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                format === 'csv'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FileText size={24} />
              <div className="text-left">
                <p className="font-medium">CSV (.csv)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Compatible universal</p>
              </div>
            </button>
          </div>
        </div>

        {/* Filters based on type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros (opcional)
            </label>
          </div>

          {type === 'orders' && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    value={orderFilters.startDate}
                    onChange={(e) => setOrderFilters({ ...orderFilters, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    value={orderFilters.endDate}
                    onChange={(e) => setOrderFilters({ ...orderFilters, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Estado del pedido
                </label>
                <select
                  value={orderFilters.status}
                  onChange={(e) => setOrderFilters({ ...orderFilters, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {type === 'products' && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Categoría
                  </label>
                  <select
                    value={productFilters.category}
                    onChange={(e) => setProductFilters({ ...productFilters, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Marca
                  </label>
                  <select
                    value={productFilters.brand}
                    onChange={(e) => setProductFilters({ ...productFilters, brand: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="">Todas las marcas</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Estado
                </label>
                <select
                  value={productFilters.isActive}
                  onChange={(e) => setProductFilters({ ...productFilters, isActive: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                >
                  {ACTIVE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {type === 'users' && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha registro desde
                  </label>
                  <input
                    type="date"
                    value={userFilters.startDate}
                    onChange={(e) => setUserFilters({ ...userFilters, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha registro hasta
                  </label>
                  <input
                    type="date"
                    value={userFilters.endDate}
                    onChange={(e) => setUserFilters({ ...userFilters, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Rol
                </label>
                <select
                  value={userFilters.role}
                  onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={resetFilters} disabled={loading}>
            Limpiar filtros
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleExport} isLoading={loading}>
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
