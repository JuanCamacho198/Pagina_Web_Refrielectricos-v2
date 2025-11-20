'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LogOut, Settings, MapPin, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="shrink-0 flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <Image 
                src="/icons/logoRefri.svg" 
                alt="Refrielectricos Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Refrielectricos
              </span>
            </Link>
            
            <div className="hidden sm:flex sm:space-x-2">
              <Link 
                href="/" 
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200"
              >
                Inicio
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200"
              >
                Productos
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                  {user.name}
                </span>
                
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none cursor-pointer"
                    aria-label="Menú de usuario"
                  >
                    <span className="font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Editar Perfil
                      </Link>
                      <Link
                        href="/profile/addresses"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MapPin className="h-4 w-4" />
                        Mis Direcciones
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        Mis Pedidos
                      </Link>
                    </div>
                  )}
                </div>

                <button 
                  onClick={logout} 
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
