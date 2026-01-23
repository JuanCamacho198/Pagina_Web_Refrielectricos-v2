import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface StoreSettings {
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
  navbarLogoUrl?: string;
  navbarLogoSize?: number;
  navbarText1?: string;
  navbarText2?: string;
  navbarText1Color?: string;
  navbarText2Color?: string;
  navbarTextSize?: string;
  navbarFont?: string;
}

const defaultSettings: StoreSettings = {
  storeName: 'Refrielectricos G&E',
  supportEmail: 'contacto@refrielectricos.com',
  phoneNumber: '3001234567',
  phoneCountryCode: '+57',
  address: '',
  currency: 'COP',
  maintenanceMode: false,
  emailNotifications: true,
  freeShippingEnabled: true,
  freeShippingBannerText: 'Envío gratis en Curumaní desde $100,000',
  freeShippingEmoji: '🚚',
  customBannerEnabled: false,
  customBannerText: '🎄 ¡Feliz Navidad! Aprovecha nuestras ofertas especiales 🎄',
  customBannerLink: '',
  customBannerBgColor: '#EF4444',
  customBannerTextColor: '#FFFFFF',
  customBannerIsAnimated: true,
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  twitterUrl: '',
  feature1Title: 'Envío Gratis',
  feature1Description: 'En pedidos superiores a $300.000',
  feature1Icon: 'Truck',
  feature1Enabled: true,
  feature2Title: 'Garantía Asegurada',
  feature2Description: 'Productos 100% originales y garantizados',
  feature2Icon: 'ShieldCheck',
  feature2Enabled: true,
  feature3Title: 'Soporte Técnico',
  feature3Description: 'Asesoría experta para tus compras',
  feature3Icon: 'Headphones',
  feature3Enabled: true,
  feature4Title: 'Pago Seguro',
  feature4Description: 'Múltiples métodos de pago confiables',
  feature4Icon: 'CreditCard',
  feature4Enabled: true,
  navbarLogoUrl: undefined,
  navbarLogoSize: 50,
  navbarText1: 'Refrielectricos',
  navbarText2: 'G&E',
  navbarText1Color: '#2563EB',
  navbarText2Color: '#3B82F6',
  navbarTextSize: 'xl',
  navbarFont: 'Roboto',
};

/**
 * Hook to access store settings
 * Provides access to store configuration like storeName, currency, contact info, etc.
 * 
 * @example
 * const { settings, isLoading } = useStoreSettings();
 * console.log(settings.storeName); // "Refrielectricos G&E"
 * console.log(settings.currency); // "COP"
 */
export function useStoreSettings() {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data } = await api.get<StoreSettings>('/settings');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 2,
  });

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
  };
}
