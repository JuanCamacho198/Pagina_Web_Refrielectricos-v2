'use client';

import { Truck, ShieldCheck, Headphones, CreditCard, Package, BadgeCheck, Clock, Gift, Zap, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const ICON_MAP: Record<string, any> = {
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  Package,
  BadgeCheck,
  Clock,
  Gift,
  Zap,
  Heart,
};

interface Feature {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface StoreSettings {
  feature1Title: string;
  feature1Description: string;
  feature1Icon: string;
  feature1Enabled: boolean;
  feature2Title: string;
  feature2Description: string;
  feature2Icon: string;
  feature2Enabled: boolean;
  feature3Title: string;
  feature3Description: string;
  feature3Icon: string;
  feature3Enabled: boolean;
  feature4Title: string;
  feature4Description: string;
  feature4Icon: string;
  feature4Enabled: boolean;
}

export default function FeaturesSection() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data } = await api.get<StoreSettings>('/settings');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Build features array from settings
  const features: Feature[] = [
    {
      title: settings?.feature1Title || 'Envío Gratis',
      description: settings?.feature1Description || 'En pedidos superiores a $300.000',
      icon: settings?.feature1Icon || 'Truck',
      enabled: settings?.feature1Enabled ?? true,
    },
    {
      title: settings?.feature2Title || 'Garantía Asegurada',
      description: settings?.feature2Description || 'Productos 100% originales y garantizados',
      icon: settings?.feature2Icon || 'ShieldCheck',
      enabled: settings?.feature2Enabled ?? true,
    },
    {
      title: settings?.feature3Title || 'Soporte Técnico',
      description: settings?.feature3Description || 'Asesoría experta para tus compras',
      icon: settings?.feature3Icon || 'Headphones',
      enabled: settings?.feature3Enabled ?? true,
    },
    {
      title: settings?.feature4Title || 'Pago Seguro',
      description: settings?.feature4Description || 'Múltiples métodos de pago confiables',
      icon: settings?.feature4Icon || 'CreditCard',
      enabled: settings?.feature4Enabled ?? true,
    },
  ].filter(f => f.enabled); // Only show enabled features

  if (isLoading || features.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {features.map((feature, index) => {
        const IconComponent = ICON_MAP[feature.icon] || Truck;
        
        return (
          <div 
            key={index} 
            className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <IconComponent size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
