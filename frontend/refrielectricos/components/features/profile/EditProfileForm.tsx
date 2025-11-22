'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { profileSchema, ProfileFormData } from '@/schemas/profile';

export default function EditProfileForm() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      await api.patch(`/users/${user.id}`, data);
      
      // Actualizar el contexto y localStorage
      // Asumimos que la respuesta devuelve el usuario actualizado.
      // Si el backend devuelve el usuario completo, lo usamos.
      // Si no, construimos uno nuevo con los datos enviados.
      const updatedUser = { ...user, ...data }; 
      // Nota: Lo ideal es que el backend devuelva el usuario actualizado.
      // Vamos a asumir que response.data es el usuario actualizado o contiene los campos.
      
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Nombre completo"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Tu nombre"
          autoComplete="name"
        />

        <Input
          label="Correo electrónico"
          {...register('email')}
          error={errors.email?.message}
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
