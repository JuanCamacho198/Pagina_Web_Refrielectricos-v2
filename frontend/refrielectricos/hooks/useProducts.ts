import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types/product';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Solicitamos un límite alto para obtener "todos" los productos en contextos donde no hay paginación explícita (Home, Admin)
      const { data } = await api.get('/products?limit=50');
      
      // Manejar respuesta paginada { data: [], meta: ... }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as Product[];
      }
      
      // Manejar respuesta array simple (legacy o si cambia el backend)
      if (Array.isArray(data)) {
        return data as Product[];
      }

      return [] as Product[];
    },
  });
};

export const useProduct = (term: string) => {
  return useQuery({
    queryKey: ['product', term],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${term}`);
      return data;
    },
    enabled: !!term,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data } = await api.post<Product>('/products', product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data } = await api.patch<Product>(`/products/${id}`, product);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: ['product', data.slug] });
      }
    },
  });
};
