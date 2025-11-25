import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types/wishlist';
import { Product } from '@/types/product';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';

export function useWishlist() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { user } = useAuth();

  const { data: wishlists = [], isLoading } = useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get<Wishlist[]>('/wishlists');
      return data;
    },
    enabled: !!user,
  });

  const createWishlistMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<Wishlist>('/wishlists', { name });
      return data;
    },
    onSuccess: (newList) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      addToast(`Lista "${newList.name}" creada`, 'success');
    },
    onError: () => {
      addToast('Error al crear la lista', 'error');
    },
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/wishlists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      addToast('Lista eliminada', 'info');
    },
    onError: () => {
      addToast('Error al eliminar la lista', 'error');
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ productId, wishlistId }: { productId: string; wishlistId: string }) => {
      await api.post(`/wishlists/${wishlistId}/items`, { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      addToast('Producto agregado a favoritos', 'success');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.response?.status === 409) {
        addToast('El producto ya está en esta lista', 'info');
      } else {
        addToast('Error al agregar a favoritos', 'error');
      }
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async ({ productId, wishlistId }: { productId: string; wishlistId: string }) => {
      await api.delete(`/wishlists/${wishlistId}/items/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      addToast('Producto eliminado de favoritos', 'info');
    },
    onError: () => {
      addToast('Error al eliminar de favoritos', 'error');
    },
  });

  const addToWishlist = async (productId: string, wishlistId?: string) => {
    if (!user) {
      addToast('Debes iniciar sesión para agregar a favoritos', 'warning');
      return;
    }

    // Optimistic update
    const previousWishlists = queryClient.getQueryData<Wishlist[]>(['wishlists']);
    
    // Find target list ID (optimistic guess)
    let targetListId = wishlistId;
    if (!targetListId) {
      const defaultList = previousWishlists?.find(list => list.name === 'Favoritos');
      targetListId = defaultList?.id;
    }

    if (targetListId) {
      queryClient.setQueryData<Wishlist[]>(['wishlists'], (old) => {
        if (!old) return [];
        return old.map(list => {
          if (list.id === targetListId) {
            return {
              ...list,
              items: [...list.items, { id: 'temp-id', wishlistId: list.id, productId, addedAt: new Date().toISOString(), product: { id: productId } as Product }]
            };
          }
          return list;
        });
      });
    }

    let finalTargetListId = wishlistId;

    if (!finalTargetListId) {
      // Buscar la lista por defecto "Favoritos"
      const defaultList = wishlists.find(list => list.name === 'Favoritos');
      
      if (defaultList) {
        finalTargetListId = defaultList.id;
      } else {
        // Si no existe, crearla
        try {
          const newList = await createWishlistMutation.mutateAsync('Favoritos');
          finalTargetListId = newList.id;
        } catch {
          // Revert optimistic update if creation fails
          queryClient.setQueryData(['wishlists'], previousWishlists);
          return; 
        }
      }
    }

    if (finalTargetListId) {
        try {
          await addItemMutation.mutateAsync({ productId, wishlistId: finalTargetListId });
        } catch {
           // Revert on error
           queryClient.setQueryData(['wishlists'], previousWishlists);
        }
    }
  };

  const removeFromWishlist = async (productId: string, wishlistId: string) => {
      // Optimistic update
      const previousWishlists = queryClient.getQueryData<Wishlist[]>(['wishlists']);
      
      queryClient.setQueryData<Wishlist[]>(['wishlists'], (old) => {
        if (!old) return [];
        return old.map(list => {
          if (list.id === wishlistId) {
            return {
              ...list,
              items: list.items.filter(item => item.productId !== productId)
            };
          }
          return list;
        });
      });

      try {
        await removeItemMutation.mutateAsync({ productId, wishlistId });
      } catch {
        // Revert on error
        queryClient.setQueryData(['wishlists'], previousWishlists);
      }
  };

  const isInWishlist = (productId: string) => {
    return wishlists.some(list => list.items.some(item => item.productId === productId));
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      addToast('Debes iniciar sesión para guardar favoritos', 'warning');
      return;
    }

    const listWithProduct = wishlists.find(list => list.items.some(item => item.productId === productId));

    if (listWithProduct) {
      await removeFromWishlist(productId, listWithProduct.id);
    } else {
      await addToWishlist(productId);
    }
  };

  return {
    createWishlist: createWishlistMutation.mutateAsync,
    deleteWishlist: deleteWishlistMutation.mutateAsync,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlists,
    loading: isLoading,
  };
}
