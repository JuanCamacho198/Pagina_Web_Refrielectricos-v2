'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  buttonText: string | null;
  isActive: boolean;
  position: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

export default function BannersPage() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners-admin'],
    queryFn: async () => {
      const { data } = await api.get<Banner[]>('/banners');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-admin'] });
      queryClient.invalidateQueries({ queryKey: ['home-banners'] });
      addToast('Banner eliminado correctamente', 'success');
    },
    onError: () => {
      addToast('Error al eliminar el banner', 'error');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/banners/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-admin'] });
      queryClient.invalidateQueries({ queryKey: ['home-banners'] });
      addToast('Estado actualizado correctamente', 'success');
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el banner "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Banners</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra los banners del carrusel principal
          </p>
        </div>
        <Link href="/admin/banners/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Banner
          </Button>
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-gray-500">Cargando banners...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No hay banners disponibles</p>
            <Link href="/admin/banners/new">
              <Button>Crear primer banner</Button>
            </Link>
          </div>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              {/* Banner Image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                      Inactivo
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-gray-900/80 px-2 py-1 rounded text-white text-xs font-mono">
                  #{banner.position}
                </div>
              </div>

              {/* Banner Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 truncate mb-3">
                    → {banner.link}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleToggleActive(banner.id, banner.isActive)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      banner.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Activo
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Inactivo
                      </>
                    )}
                  </button>
                  <Link href={`/admin/banners/${banner.id}`}>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
