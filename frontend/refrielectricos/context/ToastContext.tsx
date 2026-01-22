'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string | unknown, title?: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove all toast types with appropriate durations, except loading
    if (type !== 'loading') {
      const duration = type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type: 'success' as ToastType };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const error = useCallback((message: string | unknown, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    let errorMsg = typeof message === 'string' ? message : 'Ha ocurrido un error';
    
    if (title) errorMsg = `${title}: ${errorMsg}`;

    const newToast = { id, message: errorMsg, type: 'error' as ToastType };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const info = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type: 'info' as ToastType };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const warning = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type: 'warning' as ToastType };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const loading = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type: 'loading' as ToastType }; 
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast,
      success,
      error,
      info,
      warning,
      loading,
      dismiss
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 animate-in slide-in-from-right-full fade-in",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            {
              'border-green-500/50 bg-green-50 dark:bg-green-900/20': toast.type === 'success',
              'border-red-500/50 bg-red-50 dark:bg-red-900/20': toast.type === 'error',
              'border-blue-500/50 bg-blue-50 dark:bg-blue-900/20': toast.type === 'info' || toast.type === 'loading',
              'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20': toast.type === 'warning',
            }
          )}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          {toast.type === 'loading' && (
            <div className="w-5 h-5">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
            </div>
          )}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
          
          <p className="text-sm font-medium">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
