import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Address, CreateAddressDto, UpdateAddressDto } from '@/types/address';
import { useToast } from '@/context/ToastContext';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Address[]>('/addresses');
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // No mostrar toast si es 401 (manejado por interceptor) o si es un error silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = async (data: CreateAddressDto) => {
    setLoading(true);
    try {
      await api.post('/addresses', data);
      await fetchAddresses();
      addToast('Dirección agregada', 'success');
      return true;
    } catch (error) {
      console.error('Error creating address:', error);
      addToast('Error al crear dirección', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string, data: UpdateAddressDto) => {
    setLoading(true);
    try {
      await api.patch(`/addresses/${id}`, data);
      await fetchAddresses();
      addToast('Dirección actualizada', 'success');
      return true;
    } catch (error) {
      console.error('Error updating address:', error);
      addToast('Error al actualizar dirección', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
      addToast('Dirección eliminada', 'info');
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      addToast('Error al eliminar dirección', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
