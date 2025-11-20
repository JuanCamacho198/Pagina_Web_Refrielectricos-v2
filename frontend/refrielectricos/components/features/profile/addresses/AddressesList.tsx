'use client';

import { useState } from 'react';
import { Plus, MapPin, Trash2 } from 'lucide-react';
import AddressForm from '@/components/features/profile/addresses/AddressForm';

import { AddressFormData } from '@/types/address';

// Mock data temporal hasta que tengamos el backend listo
const MOCK_ADDRESSES = [
  {
    id: '1',
    street: 'Calle 123 # 45-67',
    neighborhood: 'El Poblado',
    department: 'Antioquia',
    city: 'Medellín',
    type: 'Apartamento',
    floor: '',
    reference: ''
  }
];

export default function AddressesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAddress = async (data: AddressFormData) => {
    setIsLoading(true);
    // Simular petición API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAddress = {
      id: Date.now().toString(),
      ...data
    };
    
    setAddresses([...addresses, newAddress]);
    setIsLoading(false);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isAdding ? 'Nueva Dirección' : 'Mis Direcciones'}
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Agregar Nueva
          </button>
        )}
      </div>

      {isAdding ? (
        <AddressForm 
          onSubmit={handleAddAddress}
          onCancel={() => setIsAdding(false)}
          isLoading={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tienes direcciones</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Agrega una dirección para tus envíos.</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div 
                key={address.id} 
                className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                      {address.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar dirección"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {address.street}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {address.neighborhood}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {address.city}, {address.department}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
