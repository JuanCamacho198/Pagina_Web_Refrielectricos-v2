import Link from 'next/link';
import { ShieldAlert, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-20 w-20 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          No tienes permisos suficientes para acceder a esta página. Si crees que es un error, contacta al administrador.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={18} />
              Ir al Inicio
            </Button>
          </Link>
          <Link href="/login">
            <Button className="flex items-center gap-2">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
