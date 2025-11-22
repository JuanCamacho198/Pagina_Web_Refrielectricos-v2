import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types/wishlist';
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

    let targetListId = wishlistId;

    if (!targetListId) {
      // Buscar la lista por defecto "Favoritos"
      const defaultList = wishlists.find(list => list.name === 'Favoritos');
      
      if (defaultList) {
        targetListId = defaultList.id;
      } else {
        // Si no existe, crearla
        try {
          const newList = await createWishlistMutation.mutateAsync('Favoritos');
          targetListId = newList.id;
        } catch (error) {
          console.error(error);
          return; // Error handled in mutation
        }
      }
    }

    if (targetListId) {
        await addItemMutation.mutateAsync({ productId, wishlistId: targetListId });
    }
  };

  const removeFromWishlist = async (productId: string, wishlistId: string) => {
      await removeItemMutation.mutateAsync({ productId, wishlistId });
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
    wishlists,
    loading: isLoading,
    createWishlist: createWishlistMutation.mutateAsync,
    deleteWishlist: deleteWishlistMutation.mutateAsync,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
}
