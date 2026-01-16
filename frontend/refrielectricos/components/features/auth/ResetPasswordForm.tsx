'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'Debe contener al menos una minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'Debe contener al menos un número';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ password: '', confirmPassword: '' });
    setServerError('');

    // Validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      return;
    }

    if (!token) {
      setServerError('Token inválido o faltante. Por favor solicita un nuevo enlace.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/auth/reset-password', {
        token,
        newPassword: formData.password,
      });
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.';
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-6 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Contraseña restablecida exitosamente</h3>
              <p className="text-sm">
                Tu contraseña ha sido actualizada. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full"
        >
          Ir a iniciar sesión
        </Button>
      </div>
    );
  }

  // No token error
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Enlace inválido</h3>
              <p className="text-sm">
                El enlace de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="w-full"
        >
          Solicitar nuevo enlace
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu nueva contraseña. Debe ser segura y fácil de recordar.
        </p>
      </div>

      {serverError && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded relative flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{serverError}</span>
        </div>
      )}

      <div className="relative">
        <Input
          label="Nueva contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Password Requirements */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Requisitos de la contraseña:
        </p>
        <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
          <li className={formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : ''}>
            • Mínimo 6 caracteres
          </li>
          <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
            • Al menos una mayúscula
          </li>
          <li className={/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
            • Al menos una minúscula
          </li>
          <li className={/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
            • Al menos un número
          </li>
        </ul>
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Recordaste tu contraseña?{' '}
        <Link 
          href="/login" 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
