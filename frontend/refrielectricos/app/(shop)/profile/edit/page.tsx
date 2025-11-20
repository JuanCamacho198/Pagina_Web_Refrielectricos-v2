'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import EditProfileForm from '@/components/features/profile/EditProfileForm';
import { Loader2 } from 'lucide-react';

export default function EditProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-8 sm:p-10">
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editar Perfil
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Actualiza tu información personal
              </p>
            </div>
            
            <EditProfileForm />
          </div>
        </div>
      </main>
    </div>
  );
}
