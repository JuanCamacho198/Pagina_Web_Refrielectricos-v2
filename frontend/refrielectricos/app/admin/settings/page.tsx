'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, Mail, Bell, Truck, RefreshCw, Layout, Palette, Share2, Building2 } from 'lucide-react';
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
  navbarLogoSize?: number;
  navbarText1?: string;
  navbarText2?: string;
  navbarText1Color?: string;
  navbarText2Color?: string;
  navbarTextSize?: string;
}

type TabType = 'general' | 'contact' | 'shipping' | 'appearance' | 'social' | 'system';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Building2 size={18} /> },
  { id: 'contact', label: 'Contacto', icon: <Mail size={18} /> },
  { id: 'shipping', label: 'Envíos & Banners', icon: <Truck size={18} /> },
  { id: 'appearance', label: 'Apariencia', icon: <Palette size={18} /> },
  { id: 'social', label: 'Redes Sociales', icon: <Share2 size={18} /> },
  { id: 'system', label: 'Sistema', icon: <Bell size={18} /> },
];

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

const TEXT_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño (sm)' },
  { value: 'base', label: 'Base' },
  { value: 'lg', label: 'Grande (lg)' },
  { value: 'xl', label: 'Extra Grande (xl)' },
  { value: '2xl', label: '2X Grande (2xl)' },
  { value: '3xl', label: '3X Grande (3xl)' },
];

const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'COP - Peso Colombiano', symbol: '$' },
  { value: 'USD', label: 'USD - Dólar Estadounidense', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'MXN', label: 'MXN - Peso Mexicano', symbol: '$' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
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
    storeName: apiSettings?.storeName || 'Refrielectricos G&E',
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
    navbarLogoSize: apiSettings?.navbarLogoSize || 50,
    navbarText1: apiSettings?.navbarText1 || 'Refrielectricos',
    navbarText2: apiSettings?.navbarText2 || 'G&E',
    navbarText1Color: apiSettings?.navbarText1Color || '#2563EB',
    navbarText2Color: apiSettings?.navbarText2Color || '#3B82F6',
    navbarTextSize: apiSettings?.navbarTextSize || 'xl',
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
    
    queryClient.setQueryData(['store-settings'], (old: StoreSettings | undefined) => ({
      ...old || settings,
      [fieldName]: newValue,
    }));

    try {
      await api.patch('/settings', {
        ...settings,
        [fieldName]: newValue,
      });
      addToast('Configuración actualizada', 'success');
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    } catch (error) {
      console.error('Error updating setting:', error);
      addToast('Error al actualizar la configuración', 'error');
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
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast('Error al guardar la configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración de la Tienda</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona la configuración general de tu tienda
          </p>
        </div>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Building2 size={20} className="text-blue-600" />
              Información General de la Tienda
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Nota:</strong> El nombre de la tienda se mostrará en el título de las páginas, metadatos SEO y el footer. 
                  La moneda se usará para formatear todos los precios en la tienda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Nombre de la Tienda"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    placeholder="Ej: Refrielectricos G&E"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Aparece en títulos, footer y metadatos SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moneda
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CURRENCY_OPTIONS.map(curr => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Se usará para formatear precios en toda la tienda
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Mail size={20} className="text-blue-600" />
              Información de Contacto y Soporte
            </h2>
            
            <div className="space-y-6">
              <Input
                label="Email de Soporte"
                name="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="contacto@ejemplo.com"
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
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Ej: Calle 14 #15-68, Curumaní, Cesar, Colombia"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Esta dirección aparecerá en el footer y la página de contacto.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            {/* Free Shipping Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Truck size={20} className="text-blue-600" />
                Configuración de Envío Gratis
              </h2>
              
              <div className="space-y-4">
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
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa del banner:</p>
                  <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 text-sm font-medium">
                    <span className="text-base">{settings.freeShippingEmoji}</span>
                    <span>{settings.freeShippingBannerText}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Custom Banner Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Globe size={20} className="text-blue-600" />
                Banner Personalizado (Navideño/Promocional)
              </h2>
              
              <div className="space-y-4">
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

                <Input
                  label="Texto del Banner"
                  name="customBannerText"
                  value={settings.customBannerText}
                  onChange={handleChange}
                  placeholder="¡Ofertas de Navidad!"
                />

                <Input
                  label="Enlace (Opcional)"
                  name="customBannerLink"
                  value={settings.customBannerLink || ''}
                  onChange={handleChange}
                  placeholder="/products?category=navidad"
                />

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
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
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
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

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
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Navbar Customization */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Layout size={20} className="text-blue-600" />
                Personalización del Navbar
              </h2>

              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Tamaño del Logo</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        label="Tamaño (píxeles)"
                        name="navbarLogoSize"
                        value={settings.navbarLogoSize || 50}
                        onChange={handleChange}
                        min="20"
                        max="200"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Rango: 20px - 200px (Recomendado: 40-80px)
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div 
                        className="bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
                        style={{
                          width: `${Math.min(settings.navbarLogoSize || 50, 80)}px`,
                          height: `${Math.min(settings.navbarLogoSize || 50, 80)}px`,
                          fontSize: `${Math.min((settings.navbarLogoSize || 50) / 3, 24)}px`
                        }}
                      >
                        LOGO
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Texto del Navbar</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tamaño del Texto
                      </label>
                      <select
                        name="navbarTextSize"
                        value={settings.navbarTextSize || 'xl'}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {TEXT_SIZE_OPTIONS.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Texto Principal"
                        name="navbarText1"
                        value={settings.navbarText1 || 'Refrielectricos'}
                        onChange={handleChange}
                        placeholder="Refrielectricos"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color del Texto Principal
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            name="navbarText1Color"
                            value={settings.navbarText1Color || '#2563EB'}
                            onChange={handleChange}
                            className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            name="navbarText1Color"
                            value={settings.navbarText1Color || '#2563EB'}
                            onChange={handleChange}
                            placeholder="#2563EB"
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Texto Secundario"
                        name="navbarText2"
                        value={settings.navbarText2 || 'G&E'}
                        onChange={handleChange}
                        placeholder="G&E"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color del Texto Secundario
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            name="navbarText2Color"
                            value={settings.navbarText2Color || '#3B82F6'}
                            onChange={handleChange}
                            className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            name="navbarText2Color"
                            value={settings.navbarText2Color || '#3B82F6'}
                            onChange={handleChange}
                            placeholder="#3B82F6"
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista Previa:</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
                          style={{
                            width: `${Math.min(settings.navbarLogoSize || 50, 48)}px`,
                            height: `${Math.min(settings.navbarLogoSize || 50, 48)}px`,
                            fontSize: `${Math.min((settings.navbarLogoSize || 50) / 3, 16)}px`
                          }}
                        >
                          L
                        </div>
                        <span 
                          className={`font-extrabold tracking-tight text-${settings.navbarTextSize || 'xl'}`}
                          style={{ color: settings.navbarText1Color || '#2563EB' }}
                        >
                          {settings.navbarText1 || 'Refrielectricos'}
                        </span>
                        <span 
                          className={`font-extrabold tracking-tight text-${settings.navbarTextSize || 'xl'} ml-1`}
                          style={{ color: settings.navbarText2Color || '#3B82F6' }}
                        >
                          {settings.navbarText2 || 'G&E'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Home Features */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Layout size={20} className="text-blue-600" />
                Características del Home
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Configura las 4 características que se muestran en la página principal
              </p>

              <div className="space-y-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">Característica {num}</h3>
                      <button
                        type="button"
                        onClick={() => handleToggle(`feature${num}Enabled` as keyof StoreSettings)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings[`feature${num}Enabled` as keyof StoreSettings] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                            settings[`feature${num}Enabled` as keyof StoreSettings] ? 'translate-x-5' : 'translate-x-0.5'
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
                          name={`feature${num}Icon`}
                          value={settings[`feature${num}Icon` as keyof StoreSettings] as string}
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
                        name={`feature${num}Title`}
                        value={settings[`feature${num}Title` as keyof StoreSettings] as string || ''}
                        onChange={handleChange}
                        className="md:col-span-1"
                      />
                      <Input
                        label="Descripción"
                        name={`feature${num}Description`}
                        value={settings[`feature${num}Description` as keyof StoreSettings] as string || ''}
                        onChange={handleChange}
                        className="md:col-span-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Share2 size={20} className="text-blue-600" />
              Redes Sociales
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Agrega los enlaces a tus redes sociales. Se mostrarán en el footer de la tienda.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell size={20} className="text-blue-600" />
              Sistema y Notificaciones
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Modo Mantenimiento</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desactiva la tienda para los clientes temporalmente</p>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibir alertas de nuevos pedidos y eventos importantes</p>
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
        )}

        {/* Submit Button */}
        <div className="flex justify-end sticky bottom-4 z-10">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="shadow-lg"
          >
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
