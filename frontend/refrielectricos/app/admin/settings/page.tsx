'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, Mail, Bell, Truck, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

interface StoreSettings {
  storeName: string;
  supportEmail: string;
  phoneNumber: string;
  phoneCountryCode: string;
  address?: string;
  currency: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  freeShippingEnabled: boolean;
  freeShippingBannerText: string;
  freeShippingEmoji: string;
}

const EMOJI_OPTIONS = [
  { value: '🚚', label: '🚚 Camión' },
  { value: '🛒', label: '🛒 Carrito' },
  { value: '🎁', label: '🎁 Regalo' },
  { value: '⚡', label: '⚡ Rayo' },
  { value: '✅', label: '✅ Check' },
  { value: '💰', label: '💰 Dinero' },
  { value: '🏷️', label: '🏷️ Etiqueta' },
  { value: '📦', label: '📦 Paquete' },
];

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiSettings, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data } = await api.get<StoreSettings>('/settings');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const settings: StoreSettings = {
    storeName: apiSettings?.storeName || '',
    supportEmail: apiSettings?.supportEmail || '',
    phoneNumber: apiSettings?.phoneNumber || '',
    phoneCountryCode: apiSettings?.phoneCountryCode || '+57',
    address: apiSettings?.address || '',
    currency: apiSettings?.currency || 'COP',
    maintenanceMode: apiSettings?.maintenanceMode ?? false,
    emailNotifications: apiSettings?.emailNotifications ?? true,
    freeShippingEnabled: apiSettings?.freeShippingEnabled ?? true,
    freeShippingBannerText: apiSettings?.freeShippingBannerText || 'Envío gratis en Curumaní desde $100,000',
    freeShippingEmoji: apiSettings?.freeShippingEmoji || '🚚',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    queryClient.setQueryData(['store-settings'], (old: StoreSettings | undefined) => ({
      ...old || settings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggle = async (fieldName: keyof StoreSettings) => {
    const newValue = !settings[fieldName];
    
    // Update local state optimistically
    queryClient.setQueryData(['store-settings'], (old: StoreSettings | undefined) => ({
      ...old || settings,
      [fieldName]: newValue,
    }));

    // Save to backend immediately
    try {
      await api.patch('/settings', {
        ...settings,
        [fieldName]: newValue,
      });
      addToast('Configuración actualizada', 'success');
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    } catch (error) {
      console.error('Error updating setting:', error);
      addToast('Error al actualizar la configuración', 'error');
      // Revert on error
      queryClient.setQueryData(['store-settings'], (old: StoreSettings | undefined) => ({
        ...old || settings,
        [fieldName]: !newValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.patch('/settings', settings);
      addToast('Configuración guardada correctamente', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast('Error al guardar la configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración de la Tienda</h1>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Globe size={20} className="text-blue-600" />
            Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Tienda"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
            />
            <Input
              label="Moneda"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              disabled
            />
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Mail size={20} className="text-blue-600" />
            Contacto y Soporte
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Email de Soporte"
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono WhatsApp
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Código País"
                  name="phoneCountryCode"
                  value={settings.phoneCountryCode}
                  onChange={handleChange}
                  placeholder="+57"
                  className="col-span-1"
                />
                <Input
                  label="Número"
                  name="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className="col-span-2"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Este número se usará en el botón de WhatsApp y el footer. Ejemplo: {settings.phoneCountryCode}{settings.phoneNumber}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección Física
              </label>
              <textarea
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Ej: Calle 14 #15-68, Curumaní, Cesar, Colombia"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Esta dirección aparecerá en el footer y la página de contacto.
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Truck size={20} className="text-blue-600" />
            Configuración de Envíos
          </h2>
          <div className="space-y-4">
            {/* Toggle for Free Shipping Enabled */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Envío Gratis Habilitado</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar banner de envío gratis en la tienda</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('freeShippingEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.freeShippingEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    settings.freeShippingEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Emoji Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emoji del Banner
              </label>
              <select
                name="freeShippingEmoji"
                value={settings.freeShippingEmoji}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {EMOJI_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Banner Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto del Banner de Envío Gratis
              </label>
              <textarea
                name="freeShippingBannerText"
                value={settings.freeShippingBannerText}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Ej: Envío gratis en Curumaní desde $100,000"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este texto aparecerá exactamente como lo escribas en el banner de la tienda.
              </p>
            </div>

            {/* Preview */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa del banner:</p>
              <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 text-sm font-medium">
                <span className="text-base">{settings.freeShippingEmoji}</span>
                <span>{settings.freeShippingBannerText}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell size={20} className="text-blue-600" />
            Sistema y Notificaciones
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Modo Mantenimiento</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Desactiva la tienda para los clientes</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('maintenanceMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibir alertas de nuevos pedidos</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    settings.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
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
