'use client';

import { Bell, AlertTriangle, Package, UserPlus, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Notification {
  type: 'CRITICAL_STOCK' | 'UNPROCESSED_ORDER' | 'NEW_USER';
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  productId?: string;
  orderId?: string;
  userId?: string;
  stock?: number;
  createdAt?: string;
}

interface NotificationData {
  criticalStock: Notification[];
  unprocessedOrders: Notification[];
  newUsers: Notification[];
}

interface NotificationPanelProps {
  notifications: NotificationData;
}

const severityConfig = {
  high: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-300 dark:border-red-900/40',
    text: 'text-red-900 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  medium: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-300 dark:border-orange-900/40',
    text: 'text-orange-900 dark:text-orange-100',
    icon: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-300 dark:border-blue-900/40',
    text: 'text-blue-900 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
};

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const allNotifications = [
    ...notifications.criticalStock,
    ...notifications.unprocessedOrders,
    ...notifications.newUsers,
  ].filter((_, index) => !dismissed.has(index.toString()));

  const handleDismiss = (index: number) => {
    setDismissed(new Set([...dismissed, index.toString()]));
  };

  if (allNotifications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <Bell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Todo bajo control
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay notificaciones urgentes en este momento
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL_STOCK':
        return AlertTriangle;
      case 'UNPROCESSED_ORDER':
        return Package;
      case 'NEW_USER':
        return UserPlus;
      default:
        return Bell;
    }
  };

  const getLink = (notif: Notification) => {
    if (notif.productId) return `/admin/products/${notif.productId}`;
    if (notif.orderId) return `/admin/orders/${notif.orderId}`;
    if (notif.userId) return `/admin/users`;
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-slate-900 dark:text-white" />
              {allNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center font-bold">
                    {allNotifications.length}
                  </span>
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Notificaciones
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Tiempo real
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
        {allNotifications.map((notif, index) => {
          const Icon = getIcon(notif.type);
          const config = severityConfig[notif.severity];
          const link = getLink(notif);

          return (
            <div
              key={index}
              className={`p-4 ${config.bg} border-l-4 ${config.border} hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all group relative`}
            >
              <button
                onClick={() => handleDismiss(index)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <div className={`p-2 rounded-lg ${config.icon} bg-white/50 dark:bg-black/20`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold text-sm ${config.text}`}>
                      {notif.title}
                    </h4>
                    <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                  </div>
                  
                  <p className={`text-sm ${config.text} opacity-90 mb-2`}>
                    {notif.message}
                  </p>

                  {link && (
                    <Link
                      href={link}
                      className={`inline-flex items-center gap-1 text-xs font-bold ${config.icon} hover:underline`}
                    >
                      Ver detalles
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
