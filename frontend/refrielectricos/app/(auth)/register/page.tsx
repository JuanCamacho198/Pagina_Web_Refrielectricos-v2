import RegisterForm from '@/components/features/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Refrielectricos
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nosotros para comprar los mejores repuestos
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
}
