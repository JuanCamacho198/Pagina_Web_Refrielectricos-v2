'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, Mail, Bell, Truck, RefreshCw, Layout } from 'lucide-react';
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
  customBannerEnabled: boolean;
  customBannerText: string;
  customBannerLink: string;
  customBannerBgColor: string;
  customBannerTextColor: string;
  customBannerIsAnimated: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  feature1Title?: string;
  feature1Description?: string;
  feature1Icon?: string;
  feature1Enabled?: boolean;
  feature2Title?: string;
  feature2Description?: string;
  feature2Icon?: string;
  feature2Enabled?: boolean;
  feature3Title?: string;
  feature3Description?: string;
  feature3Icon?: string;
  feature3Enabled?: boolean;
  feature4Title?: string;
  feature4Description?: string;
  feature4Icon?: string;
  feature4Enabled?: boolean;
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

const ICON_OPTIONS = [
  { value: 'Truck', label: 'Camión' },
  { value: 'ShieldCheck', label: 'Escudo' },
  { value: 'Headphones', label: 'Audífonos' },
  { value: 'CreditCard', label: 'Tarjeta' },
  { value: 'Package', label: 'Paquete' },
  { value: 'BadgeCheck', label: 'Insignia' },
  { value: 'Clock', label: 'Reloj' },
  { value: 'Gift', label: 'Regalo' },
  { value: 'Zap', label: 'Rayo' },
  { value: 'Heart', label: 'Corazón' },
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
    customBannerEnabled: apiSettings?.customBannerEnabled ?? false,
    customBannerText: apiSettings?.customBannerText || '🎄 ¡Feliz Navidad! Aprovecha nuestras ofertas especiales 🎄',
    customBannerLink: apiSettings?.customBannerLink || '',
    customBannerBgColor: apiSettings?.customBannerBgColor || '#EF4444',
    customBannerTextColor: apiSettings?.customBannerTextColor || '#FFFFFF',
    customBannerIsAnimated: apiSettings?.customBannerIsAnimated ?? true,
    facebookUrl: apiSettings?.facebookUrl || '',
    instagramUrl: apiSettings?.instagramUrl || '',
    tiktokUrl: apiSettings?.tiktokUrl || '',
    twitterUrl: apiSettings?.twitterUrl || '',
    feature1Title: apiSettings?.feature1Title || 'Envío Gratis',
    feature1Description: apiSettings?.feature1Description || 'En pedidos superiores a $300.000',
    feature1Icon: apiSettings?.feature1Icon || 'Truck',
    feature1Enabled: apiSettings?.feature1Enabled ?? true,
    feature2Title: apiSettings?.feature2Title || 'Garantía Asegurada',
    feature2Description: apiSettings?.feature2Description || 'Productos 100% originales y garantizados',
    feature2Icon: apiSettings?.feature2Icon || 'ShieldCheck',
    feature2Enabled: apiSettings?.feature2Enabled ?? true,
    feature3Title: apiSettings?.feature3Title || 'Soporte Técnico',
    feature3Description: apiSettings?.feature3Description || 'Asesoría experta para tus compras',
    feature3Icon: apiSettings?.feature3Icon || 'Headphones',
    feature3Enabled: apiSettings?.feature3Enabled ?? true,
    feature4Title: apiSettings?.feature4Title || 'Pago Seguro',
    feature4Description: apiSettings?.feature4Description || 'Múltiples métodos de pago confiables',
    feature4Icon: apiSettings?.feature4Icon || 'CreditCard',
    feature4Enabled: apiSettings?.feature4Enabled ?? true,
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

        {/* Custom Animated Banner Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Globe size={20} className="text-blue-600" />
            Banner Personalizado (Navideño/Promocional)
          </h2>
          <div className="space-y-4">
            {/* Toggle for Custom Banner */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Habilitar Banner Personalizado</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar segundo banner con animación opcional</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('customBannerEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.customBannerEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    settings.customBannerEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Toggle for Animation */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Animación de Desplazamiento</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">El texto se moverá de derecha a izquierda</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('customBannerIsAnimated')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.customBannerIsAnimated ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    settings.customBannerIsAnimated ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Banner Text */}
            <Input
              label="Texto del Banner"
              name="customBannerText"
              value={settings.customBannerText}
              onChange={handleChange}
              placeholder="¡Ofertas de Navidad!"
            />

            {/* Banner Link (Optional) */}
            <Input
              label="Enlace (Opcional)"
              name="customBannerLink"
              value={settings.customBannerLink || ''}
              onChange={handleChange}
              placeholder="/products?category=navidad"
            />

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color de Fondo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="customBannerBgColor"
                    value={settings.customBannerBgColor}
                    onChange={handleChange}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    name="customBannerBgColor"
                    value={settings.customBannerBgColor}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color del Texto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="customBannerTextColor"
                    value={settings.customBannerTextColor}
                    onChange={handleChange}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    name="customBannerTextColor"
                    value={settings.customBannerTextColor}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa en tiempo real:</p>
              <div 
                className="w-full py-2 px-4 text-center text-sm font-medium rounded-lg shadow-sm overflow-hidden relative"
                style={{ 
                  backgroundColor: settings.customBannerBgColor, 
                  color: settings.customBannerTextColor 
                }}
              >
                {settings.customBannerIsAnimated ? (
                   <div className="animate-marquee whitespace-nowrap">
                     {settings.customBannerText}
                   </div>
                ) : (
                  settings.customBannerText
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Globe size={20} className="text-blue-600" />
            Redes Sociales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Facebook URL"
              name="facebookUrl"
              value={settings.facebookUrl || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/tuempresa"
            />
            <Input
              label="Instagram URL"
              name="instagramUrl"
              value={settings.instagramUrl || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/tuempresa"
            />
            <Input
              label="TikTok URL"
              name="tiktokUrl"
              value={settings.tiktokUrl || ''}
              onChange={handleChange}
              placeholder="https://tiktok.com/@tuempresa"
            />
            <Input
              label="Twitter/X URL"
              name="twitterUrl"
              value={settings.twitterUrl || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/tuempresa"
            />
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

        {/* Home Features Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Layout size={20} className="text-blue-600" />
            Características del Home
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Configura las 4 características que se muestran en la página principal
          </p>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Característica 1</h3>
                <button
                  type="button"
                  onClick={() => handleToggle('feature1Enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.feature1Enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      settings.feature1Enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icono
                  </label>
                  <select
                    name="feature1Icon"
                    value={settings.feature1Icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Título"
                  name="feature1Title"
                  value={settings.feature1Title || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
                <Input
                  label="Descripción"
                  name="feature1Description"
                  value={settings.feature1Description || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Característica 2</h3>
                <button
                  type="button"
                  onClick={() => handleToggle('feature2Enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.feature2Enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      settings.feature2Enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icono
                  </label>
                  <select
                    name="feature2Icon"
                    value={settings.feature2Icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Título"
                  name="feature2Title"
                  value={settings.feature2Title || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
                <Input
                  label="Descripción"
                  name="feature2Description"
                  value={settings.feature2Description || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Característica 3</h3>
                <button
                  type="button"
                  onClick={() => handleToggle('feature3Enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.feature3Enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      settings.feature3Enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icono
                  </label>
                  <select
                    name="feature3Icon"
                    value={settings.feature3Icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Título"
                  name="feature3Title"
                  value={settings.feature3Title || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
                <Input
                  label="Descripción"
                  name="feature3Description"
                  value={settings.feature3Description || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Característica 4</h3>
                <button
                  type="button"
                  onClick={() => handleToggle('feature4Enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.feature4Enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      settings.feature4Enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icono
                  </label>
                  <select
                    name="feature4Icon"
                    value={settings.feature4Icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Título"
                  name="feature4Title"
                  value={settings.feature4Title || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
                <Input
                  label="Descripción"
                  name="feature4Description"
                  value={settings.feature4Description || ''}
                  onChange={handleChange}
                  className="md:col-span-1"
                />
              </div>
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
