'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { Wishlist } from '@/types/wishlist';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlists: Wishlist[];
  loading: boolean;
  refreshWishlists: () => Promise<void>;
  createWishlist: (name: string) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  addToWishlist: (productId: string, wishlistId?: string) => Promise<void>;
  removeFromWishlist: (productId: string, wishlistId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlists = async () => {
    if (!user) {
      setWishlists([]);
      return;
    }
    try {
      const res = await api.get('/wishlists');
      setWishlists(res.data);
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    }
  };

  useEffect(() => {
    refreshWishlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createWishlist = async (name: string) => {
    try {
      setLoading(true);
      await api.post('/wishlists', { name });
      await refreshWishlists();
      addToast(`Lista "${name}" creada`, 'success');
    } catch (error) {
      console.error('Error creating wishlist:', error);
      addToast('Error al crear la lista', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteWishlist = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/wishlists/${id}`);
      await refreshWishlists();
      addToast('Lista eliminada', 'info');
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      addToast('Error al eliminar la lista', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string, wishlistId?: string) => {
    if (!user) {
      addToast('Debes iniciar sesión para agregar a favoritos', 'warning');
      return; 
    }
    
    let targetListId = wishlistId;

    // Si no se especifica lista, usar la primera o crear una "Favoritos"
    if (!targetListId) {
      if (wishlists.length === 0) {
        try {
          const res = await api.post('/wishlists', { name: 'Favoritos' });
          targetListId = res.data.id;
          // Actualizamos estado local optimista o esperamos refresh
          setWishlists([res.data]); 
        } catch (error) {
          console.error('Error creating default wishlist:', error);
          addToast('Error al crear lista de favoritos', 'error');
          return;
        }
      } else {
        targetListId = wishlists[0].id;
      }
    }

    try {
      await api.post(`/wishlists/${targetListId}/items`, { productId });
      await refreshWishlists();
      addToast('Producto agregado a favoritos', 'success');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.status === 409) {
        addToast('El producto ya está en esta lista', 'info');
        return;
      }
      console.error('Error adding to wishlist:', error);
      addToast('Error al agregar a favoritos', 'error');
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string, wishlistId: string) => {
    try {
      await api.delete(`/wishlists/${wishlistId}/items/${productId}`);
      await refreshWishlists();
      addToast('Producto eliminado de favoritos', 'info');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      addToast('Error al eliminar de favoritos', 'error');
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
      // Si ya está, lo quitamos de esa lista
      await removeFromWishlist(productId, listWithProduct.id);
    } else {
      // Si no está, lo agregamos a la default
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlists,
      loading,
      refreshWishlists,
      createWishlist,
      deleteWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
