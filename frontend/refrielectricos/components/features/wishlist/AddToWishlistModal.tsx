'use client';

import { useState } from 'react';
import { Plus, Heart, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/context/ToastContext';

interface AddToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export default function AddToWishlistModal({ isOpen, onClose, productId }: AddToWishlistModalProps) {
  const { wishlists, createWishlist, addToWishlist } = useWishlist();
  const { addToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (wishlistId: string) => {
    setLoading(true);
    try {
      await addToWishlist(productId, wishlistId);
      onClose();
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setLoading(true);
    try {
      await createWishlist(newListName);
      // The new list is now in 'wishlists' (optimistically or after refresh)
      // We could auto-add to it, but for now let's just go back to selection
      setIsCreating(false);
      setNewListName('');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guardar en lista de deseos"
    >
      {isCreating ? (
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nombre de la nueva lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Ej: Mi PC Gamer"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsCreating(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !newListName.trim()}>
              {loading ? 'Creando...' : 'Crear Lista'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {wishlists.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wishlists.map((list) => {
                const hasProduct = list.items.some(item => item.productId === productId);
                return (
                  <button
                    key={list.id}
                    onClick={() => !hasProduct && handleAdd(list.id)}
                    disabled={loading || hasProduct}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </span>
                    {hasProduct && <Check size={16} className="text-green-500" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No tienes listas creadas aún.
            </p>
          )}

          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={16} />
            Crear nueva lista
          </Button>
        </div>
      )}
    </Modal>
  );
}
