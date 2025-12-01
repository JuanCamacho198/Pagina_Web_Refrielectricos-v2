'use client';

import { useState, useMemo } from 'react';
import { departamentos } from '@/data/colombiaData';
import { CreateAddressDto } from '@/types/address';
import Combobox from '@/components/ui/Combobox';

interface AddressFormProps {
  onSubmit: (data: CreateAddressDto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function AddressForm({ onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    department: '',
    city: '',
    neighborhood: '',
    floor: '',
    type: '',
    reference: '',
    isDefault: false
  });

  const selectedDeptData = useMemo(() => {
    return departamentos.find(d => d.nombre === formData.department);
  }, [formData.department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const addressLine2 = [
      formData.type,
      formData.neighborhood ? `Barrio: ${formData.neighborhood}` : '',
      formData.floor ? `Int/Apto: ${formData.floor}` : '',
      formData.reference
    ].filter(Boolean).join(', ');

    const submitData: CreateAddressDto = {
      fullName: formData.fullName,
      phone: formData.phone,
      addressLine1: formData.street,
      addressLine2,
      city: formData.city,
      state: formData.department,
      country: 'Colombia',
      isDefault: formData.isDefault
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      
      {/* Datos Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Ej: Calle 71d #45-67 sur"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          autoComplete="street-address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Departamento <span className="text-red-500">*</span>
          </label>
          <Combobox
            options={departamentos.map(d => d.nombre)}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val, city: '' })}
            placeholder="Seleccionar departamento"
            searchPlaceholder="Buscar departamento..."
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Ciudad / Municipio <span className="text-red-500">*</span>
          </label>
          <Combobox
            options={selectedDeptData ? selectedDeptData.ciudades : []}
            value={formData.city}
            onChange={(val) => setFormData({ ...formData, city: val })}
            placeholder="Seleccionar ciudad"
            searchPlaceholder="Buscar ciudad..."
            disabled={!formData.department}
          />
        </div>
      </div>

      {/* Barrio y Piso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Barrio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ej: El Poblado"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Piso / Apto (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Apto 302"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
          />
        </div>
      </div>

      {/* Tipo de Domicilio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Tipo de Domicilio <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {['Casa', 'Apartamento', 'Oficina'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${
                formData.type === type
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Referencias */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Referencias Adicionales
        </label>
        <textarea
          rows={3}
          placeholder="Ej: Casa con reja negra al frente"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
        />
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
          Establecer como dirección predeterminada
        </label>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Guardando...' : 'Guardar Dirección'}
        </button>
      </div>
    </form>
  );
}
