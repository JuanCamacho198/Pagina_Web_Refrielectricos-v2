'use client';

import { useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { AlertTriangle, Loader2, Info } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';
import { api } from '@/lib/api';

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
  const [providerWarning, setProviderWarning] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const registered = searchParams.get('registered');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check auth provider when email is typed
  const checkProvider = useCallback(async (email: string) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setProviderWarning('');
      return;
    }

    // Debounce by 500ms
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await api.get(`/auth/check-provider?email=${encodeURIComponent(email)}`);
        const data = response.data;

        if (data.exists && data.provider === 'GOOGLE') {
          setProviderWarning('Esta cuenta usa Google Sign-In. Usa el botón "Continuar con Google" arriba.');
        } else {
          setProviderWarning('');
        }
      } catch (error) {
        // Silently fail - don't show errors for this check
        setProviderWarning('');
      }
    }, 500);
  }, []);

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
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (serverError) setServerError('');
    
    // Check provider when email changes
    if (name === 'email') {
      checkProvider(value);
    }
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

      {providerWarning && (
        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
          <Info className="h-5 w-5 flex-shrink-0" />
          <span className="block sm:inline">{providerWarning}</span>
        </div>
      )}

      {/* Google Sign-In Button */}
      <div className="space-y-4">
        <GoogleLoginButton
          text="signin_with"
          onSuccess={() => {
            clearLocalCart();
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
        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
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
