'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El correo es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El correo no es válido');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al enviar el correo. Intenta nuevamente.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-6 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Correo enviado exitosamente</h3>
              <p className="text-sm">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
              </p>
              <p className="text-sm">
                Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-3">
                El enlace expirará en 1 hora. Si no recibiste el correo, revisa tu carpeta de spam.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Ir a iniciar sesión
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            variant="outline"
            className="w-full"
          >
            Enviar otro correo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded relative flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="juan@ejemplo.com"
          autoComplete="email"
          error={error}
        />
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Por seguridad, este proceso está limitado a 2 intentos por minuto.
        </p>
      </div>
    </form>
  );
}
