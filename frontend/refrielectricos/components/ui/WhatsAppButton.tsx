'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '573001234567'; // Reemplazar con el número real de Refrielectricos
const DEFAULT_MESSAGE = '¡Hola! Tengo una pregunta sobre sus productos.';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sm mb-1">¿Tienes preguntas?</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Estamos aquí para ayudarte. ¡Escríbenos!
                </p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="group relative bg-[#25D366] hover:bg-[#22c55e] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} className="animate-pulse group-hover:animate-none" />
        
        {/* Efecto de pulso */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      </motion.button>
    </div>
  );
}
