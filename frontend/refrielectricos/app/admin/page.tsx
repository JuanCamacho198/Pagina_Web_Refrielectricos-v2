'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowUpRight, Activity, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import DashboardSkeleton from '@/components/features/admin/dashboard/DashboardSkeleton';

const RevenueChart = dynamic(() => import('@/components/features/admin/dashboard/RevenueChart'), {
  loading: () => <div className="h-[380px] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl animate-pulse" />,
  ssr: false,
});

const OrderStatusChart = dynamic(() => import('@/components/features/admin/dashboard/OrderStatusChart'), {
  loading: () => <div className="h-80 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl animate-pulse" />,
  ssr: false,
});

const RecentOrders = dynamic(() => import('@/components/features/admin/dashboard/RecentOrders'), {
  loading: () => <div className="h-[420px] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl animate-pulse" />,
});

const TopProducts = dynamic(() => import('@/components/features/admin/dashboard/TopProducts'), {
  loading: () => <div className="h-[420px] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl animate-pulse" />,
});

interface DashboardStats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
  revenueByMonth: { name: string; total: number }[];
  orderStatusDistribution: { name: string; value: number }[];
  topProducts: { id: string; name: string; sold: number }[];
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }[];
}

export default function AdminDashboard() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/dashboard/stats');
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = data || {
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    revenueByMonth: [],
    orderStatusDistribution: [],
    topProducts: [],
    recentOrders: [],
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-transparent to-emerald-600/5 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Panel de Control
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
              Resumen de tu negocio en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-gray-500 ${isFetching ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isFetching ? 'Actualizando...' : 'Actualizar'}
              </span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <Activity className={`h-4 w-4 ${isFetching ? 'text-amber-500' : 'text-emerald-500'} ${!isFetching ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isFetching ? 'Sincronizando...' : 'Actualizado'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard 
          title="Ingresos Totales" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12.5%"
          trendUp={true}
          colorScheme="emerald"
        />
        <StatsCard 
          title="Pedidos" 
          value={stats.orders.toLocaleString()} 
          icon={ShoppingBag} 
          trend="+8.2%"
          trendUp={true}
          colorScheme="blue"
        />
        <StatsCard 
          title="Productos" 
          value={stats.products.toLocaleString()} 
          icon={Package} 
          trend="+2.1%"
          trendUp={true}
          colorScheme="violet"
        />
        <StatsCard 
          title="Usuarios" 
          value={stats.users.toLocaleString()} 
          icon={Users} 
          trend="+5.7%"
          trendUp={true}
          colorScheme="amber"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={stats.revenueByMonth} />
        </div>
        <div>
          <OrderStatusChart data={stats.orderStatusDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentOrders orders={stats.recentOrders} />
        </div>
        <div>
          <TopProducts products={stats.topProducts} />
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  colorScheme: 'emerald' | 'blue' | 'violet' | 'amber';
}

const colorSchemes = {
  emerald: {
    bg: 'bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-600/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    accent: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-500',
  },
  blue: {
    bg: 'bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/20',
    icon: 'text-blue-600 dark:text-blue-400',
    accent: 'bg-blue-500',
    shadow: 'shadow-blue-500/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  violet: {
    bg: 'bg-linear-to-br from-violet-50 to-violet-100 dark:from-violet-500/10 dark:to-violet-600/20',
    icon: 'text-violet-600 dark:text-violet-400',
    accent: 'bg-violet-500',
    shadow: 'shadow-violet-500/20',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  amber: {
    bg: 'bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-600/20',
    icon: 'text-amber-600 dark:text-amber-400',
    accent: 'bg-amber-500',
    shadow: 'shadow-amber-500/20',
    gradient: 'from-amber-500 to-orange-500',
  },
};

function StatsCard({ title, value, icon: Icon, trend, trendUp, colorScheme }: StatsCardProps) {
  const scheme = colorSchemes[colorScheme];
  
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${scheme.bg} border border-white/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-black/20`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/40 to-transparent dark:from-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</span>
            {trend && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trendUp 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
              }`}>
                {trendUp ? <TrendingUp className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3 rotate-90" />}
                {trend}
              </span>
            )}
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg ${scheme.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`h-6 w-6 ${scheme.icon}`} />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50" />
    </div>
  );
}
