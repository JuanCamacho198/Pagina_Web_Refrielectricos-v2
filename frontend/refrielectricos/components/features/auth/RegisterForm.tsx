'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import GoogleLoginButton from './GoogleLoginButton';
import { Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, login, isRegistering } = useAuth();
  const { mergeCart } = useCart();
  const localItems = useCartStore(state => state.items);
  const clearLocalCart = useCartStore(state => state.clearCart);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // 1. Register the user
      await register(formData);
      
      // 2. Auto-login after registration
      setIsLoggingIn(true);
      await login({ email: formData.email, password: formData.password, rememberMe: true });
      
      // 3. Merge local cart to user's account (only on registration)
      if (localItems.length > 0) {
        const itemsToMerge = localItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));
        await mergeCart(itemsToMerge);
        clearLocalCart();
      }

      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    } catch (error) {
      // Error handled in hook
      setIsLoggingIn(false);
      const err = error as { response?: { data?: { message?: string } } };
      setServerError(err.response?.data?.message || 'Error al crear la cuenta');
    }
  };

  const isProcessing = isRegistering || isLoggingIn;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Google Sign-In Button */}
      <div className="space-y-4">
        <GoogleLoginButton
          text="signup_with"
          onSuccess={async () => {
            // Merge cart after Google registration
            if (localItems.length > 0) {
              const itemsToMerge = localItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
              }));
              await mergeCart(itemsToMerge);
              clearLocalCart();
            }
            const redirect = searchParams.get('redirect');
            router.push(redirect || '/');
          }}
          onError={(error) => setServerError(error)}
          className="relative"
        />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              O continúa con
            </span>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {serverError}
        </div>
      )}

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
          error={errors.name}
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
          error={errors.email}
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
          error={errors.password}
        />
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isProcessing}
      >
        {isRegistering && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
        {isRegistering ? 'Creando cuenta...' : isLoggingIn ? 'Iniciando sesión...' : 'Crear cuenta'}
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link 
          href={searchParams.get('redirect') ? `/login?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : '/login'} 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
