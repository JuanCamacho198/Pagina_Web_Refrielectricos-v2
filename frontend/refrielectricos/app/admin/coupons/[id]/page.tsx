'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';

interface CouponFormData {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const couponId = params.id as string;

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    isActive: true,
    startsAt: '',
    expiresAt: '',
  });

  const { data: coupon, isLoading } = useQuery({
    queryKey: ['coupon', couponId],
    queryFn: async () => {
      const { data } = await api.get(`/coupons/${couponId}`);
      return data;
    },
    enabled: !!couponId,
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        discountType: coupon.discountType || 'PERCENTAGE',
        discountValue: coupon.discountValue || 0,
        minPurchaseAmount: coupon.minPurchaseAmount || 0,
        maxDiscountAmount: coupon.maxDiscountAmount || 0,
        usageLimit: coupon.usageLimit || 0,
        isActive: coupon.isActive ?? true,
        startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : '',
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [coupon]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CouponFormData>) => api.patch(`/coupons/${couponId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupon', couponId] });
      addToast('Cupón actualizado correctamente', 'success');
      router.push('/admin/coupons');
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || 'Error al actualizar el cupón', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      code: formData.code.toUpperCase(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      isActive: formData.isActive,
    };

    if (formData.minPurchaseAmount > 0) {
      payload.minPurchaseAmount = Number(formData.minPurchaseAmount);
    }

    if (formData.maxDiscountAmount > 0) {
      payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
    }

    if (formData.usageLimit > 0) {
      payload.usageLimit = Number(formData.usageLimit);
    }

    if (formData.startsAt) {
      payload.startsAt = new Date(formData.startsAt).toISOString();
    }

    if (formData.expiresAt) {
      payload.expiresAt = new Date(formData.expiresAt).toISOString();
    }

    updateMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-gray-500">Cargando cupón...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Cupón</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Modifica la configuración del cupón {formData.code}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información Básica</h2>
          <div className="space-y-4">
            <div>
              <Input
                label="Código del Cupón"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="VERANO2024"
                className="uppercase"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                El código será convertido a mayúsculas automáticamente
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descripción opcional del cupón"
              />
            </div>
          </div>
        </Card>

        {/* Discount Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Configuración de Descuento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Descuento
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Valor Fijo ($)</option>
              </select>
            </div>

            <Input
              label={formData.discountType === 'PERCENTAGE' ? 'Porcentaje (%)' : 'Valor ($)'}
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="0"
              max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
            />

            <div>
              <Input
                label="Compra Mínima ($)"
                name="minPurchaseAmount"
                type="number"
                value={formData.minPurchaseAmount}
                onChange={handleChange}
                min="0"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0 = sin mínimo</p>
            </div>

            {formData.discountType === 'PERCENTAGE' && (
              <div>
                <Input
                  label="Descuento Máximo ($)"
                  name="maxDiscountAmount"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  min="0"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0 = sin límite</p>
              </div>
            )}
          </div>
        </Card>

        {/* Usage Limits */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Límites de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Límite de Usos"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                min="0"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0 = ilimitado</p>
            </div>
            {coupon?.usageCount !== undefined && (
              <div className="flex flex-col justify-end">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Usos actuales: <span className="font-semibold text-gray-900 dark:text-white">{coupon.usageCount}</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Validity Period */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Período de Validez</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Fecha de Inicio"
                name="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dejar vacío para empezar inmediatamente</p>
            </div>

            <div>
              <Input
                label="Fecha de Expiración"
                name="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dejar vacío para sin expiración</p>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Cupón Activo</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Los clientes podrán usar este cupón inmediatamente
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/coupons">
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
