'use client';

import { useEffect, useState } from 'react';
import { Wrench, Clock, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Auto-refresh every 30 seconds to check if maintenance is over
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative h-24 w-64">
            <Image
              src="/images/RefriLogo.png"
              alt="Refrielectricos Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center border-4 border-blue-600 dark:border-blue-400">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 dark:bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-blue-600 dark:bg-blue-400 p-6 rounded-full">
                <Wrench className="h-16 w-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Estamos en Mantenimiento
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Estamos trabajando para mejorar tu experiencia. Volveremos pronto con mejoras increíbles.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Regresaremos Pronto
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Estamos actualizando nuestro sistema para ofrecerte un mejor servicio
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Necesitas Ayuda?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Contáctanos vía email o WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ¿Necesitas ayuda urgente? Contáctanos:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:contacto@refrielectricos.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </a>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Auto-refresh notice */}
          <div className="mt-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Esta página se actualizará automáticamente cada 30 segundos
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Refrielectricos G&E. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
