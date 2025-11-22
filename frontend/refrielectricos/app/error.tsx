'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        ¡Ups! Algo salió mal
      </h2>
      <p className="max-w-md text-gray-600 dark:text-gray-400">
        Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        Por favor, intenta recargar la página.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Ir al inicio
        </Button>
        <Button onClick={() => reset()}>
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
