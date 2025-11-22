'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default function RegisterForm() {
  const { register, isRegistering } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Nombre completo"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Juan Pérez"
          autoComplete="name"
        />
      </div>

      <div>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@ejemplo.com"
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          label="Contraseña"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isRegistering}
      >
        {isRegistering ? 'Registrando...' : 'Crear cuenta'}
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
