'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn } = useAuth();
  const clearLocalCart = useCartStore(state => state.clearCart);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const registered = searchParams.get('registered');

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

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
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ ...formData, rememberMe });
      
      // On login, discard local cart and use server cart
      // (merge only happens on registration)
      clearLocalCart();

      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    } catch (error: unknown) {
      // Error handled in hook but we also show it here for better UX
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Credenciales inválidas';
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {registered && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          Cuenta creada exitosamente. Por favor inicia sesión.
        </div>
      )}

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
          <AlertTriangle className="h-5 w-5" />
          <span className="block sm:inline">{serverError}</span>
        </div>
      )}
      
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
          autoComplete="current-password"
          error={errors.password}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
            Recordar contraseña
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isLoggingIn}
      >
        {isLoggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link 
          href={searchParams.get('redirect') ? `/register?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : '/register'} 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
}
