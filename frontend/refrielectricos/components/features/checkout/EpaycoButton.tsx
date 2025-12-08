'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface CartItem {
  id: string;
  quantity: number;
}

interface EpaycoButtonProps {
  userId: string;
  addressId: string;
  items: CartItem[];
  notes?: string;
  totalPrice: number;
  disabled?: boolean;
  onError?: (error: string) => void;
  onOrderCreated?: (orderId: string) => void;
}

// Declare ePayco global type
declare global {
  interface Window {
    ePayco?: {
      checkout: {
        configure: (config: Record<string, unknown>) => {
          open: (data: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/**
 * EpaycoButton Component
 * 
 * Uses ePayco's Standard Checkout (JavaScript SDK) to open payment modal.
 * Flow:
 * 1. Load ePayco SDK script
 * 2. Call backend to create payment session and get order data
 * 3. Open ePayco checkout modal with the data
 */
export default function EpaycoButton({
  userId,
  addressId,
  items,
  notes,
  totalPrice,
  disabled = false,
  onError,
  onOrderCreated,
}: EpaycoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load ePayco SDK script on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ePayco) {
      const script = document.createElement('script');
      script.src = 'https://checkout.epayco.co/checkout.js';
      script.async = true;
      script.onload = () => {
        setSdkLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load ePayco SDK');
        onError?.('Error al cargar el sistema de pagos');
      };
      document.body.appendChild(script);
    } else if (window.ePayco) {
      setSdkLoaded(true);
    }
  }, [onError]);

  const handlePayWithEpayco = useCallback(async () => {
    if (!userId || !addressId || items.length === 0) {
      onError?.('Faltan datos para procesar el pago');
      return;
    }

    if (!window.ePayco) {
      onError?.('El sistema de pagos no está disponible. Recarga la página.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call backend to create payment session
      const response = await api.post('/payments/create-session', {
        userId,
        addressId,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        notes,
      });

      const { success, orderId, epaycoData } = response.data;

      if (!success || !epaycoData) {
        throw new Error('Error al crear la sesión de pago');
      }

      // Notify parent that order was created
      onOrderCreated?.(orderId);

      // 2. Configure and open ePayco checkout
      const handler = window.ePayco.checkout.configure({
        key: epaycoData.public_key,
        test: epaycoData.test === 'true' || epaycoData.test === true,
      });

      // 3. Open checkout modal
      handler.open({
        // External reference (for identification)
        external: 'false',
        
        // Transaction info
        name: epaycoData.name || 'Compra Refrielectricos',
        description: epaycoData.description,
        invoice: epaycoData.invoice,
        currency: epaycoData.currency || 'cop',
        amount: epaycoData.amount,
        tax_base: epaycoData.tax_base || '0',
        tax: epaycoData.tax || '0',
        tax_ico: '0',
        country: 'co',
        lang: 'es',
        
        // Customer info
        name_billing: epaycoData.name_billing,
        address_billing: epaycoData.address_billing,
        mobilephone_billing: epaycoData.mobilephone_billing,
        
        // Callback URLs
        response: epaycoData.response,
        confirmation: epaycoData.confirmation,
        
        // Extra data (to identify order in webhook)
        extra1: epaycoData.extra1, // orderId
        extra2: epaycoData.extra2, // userId
        extra3: epaycoData.extra3 || '',

        // Method selection (show all available)
        methodsDisable: [],
      });

      setIsLoading(false);

    } catch (error: unknown) {
      console.error('Error creating ePayco session:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Error al procesar el pago con ePayco';
      onError?.(errorMessage);
      setIsLoading(false);
    }
  }, [userId, addressId, items, notes, onError, onOrderCreated]);

  return (
    <Button
      type="button"
      onClick={handlePayWithEpayco}
      className="w-full bg-[#009EE3] hover:bg-[#0080B8] text-white"
      size="lg"
      disabled={disabled || isLoading || !sdkLoaded || !addressId || items.length === 0}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando con ePayco...
        </>
      ) : !sdkLoaded ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar con ePayco - ${totalPrice.toLocaleString('es-CO')} COP
        </>
      )}
    </Button>
  );
}
