'use client';

import { Truck, ShieldCheck, Headphones, CreditCard, Package, BadgeCheck, Clock, Gift, Zap, Heart } from 'lucide-react';

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

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  if (features.length === 0) {
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
