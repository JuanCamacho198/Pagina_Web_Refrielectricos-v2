import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-20 w-20 text-blue-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Página no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button className="flex items-center gap-2">
            <Home size={18} />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
