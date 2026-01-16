'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación inválido o faltante.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage('Tu correo electrónico ha sido verificado exitosamente.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        const errorMessage = err.response?.data?.message || 'Error al verificar el correo. El enlace puede haber expirado.';
        setMessage(errorMessage);
        
        // Allow resend if token expired
        if (errorMessage.includes('expirado') || errorMessage.includes('expired')) {
          setCanResend(true);
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess(false);

    try {
      // This would need the user's email - for now we'll show a message to go to login
      setMessage('Por favor inicia sesión para reenviar el correo de verificación.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error al reenviar el correo.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Verificación de correo
          </h2>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">
                Verificando tu correo electrónico...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">¡Verificación exitosa!</h3>
                    <p className="text-sm">{message}</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-3">
                      Redirigiendo al inicio de sesión...
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
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="h-8 w-8 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Error de verificación</h3>
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {canResend ? (
                  <Button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Reenviar correo de verificación
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Ir a iniciar sesión
                  </Button>
                )}

                <Link
                  href="/forgot-password"
                  className="text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            ¿Necesitas ayuda?{' '}
            <a 
              href="mailto:soporte@refrielectricos.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
