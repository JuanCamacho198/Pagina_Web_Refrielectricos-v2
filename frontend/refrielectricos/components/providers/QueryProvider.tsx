'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Por defecto, los datos se consideran frescos por 1 minuto
        staleTime: 60 * 1000,
        // Evitar recargas automáticas al cambiar de ventana para no saturar la API innecesariamente
        refetchOnWindowFocus: false,
        // Reintentar 1 vez si falla la petición
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
