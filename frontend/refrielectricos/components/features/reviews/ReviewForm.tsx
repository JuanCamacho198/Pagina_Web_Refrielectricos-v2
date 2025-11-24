'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StarRating } from './StarRating';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

const reviewSchema = z.object({
  rating: z
    .number()
    .min(0.5, 'Debes seleccionar al menos media estrella')
    .max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        productId,
        ...data,
      });
      addToast('Reseña publicada con éxito', 'success');
      reset();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || 'Error al publicar reseña';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Escribe una reseña</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Calificación
        </label>
        <StarRating 
          value={rating} 
          onChange={(val) => setValue('rating', val, { shouldValidate: true })} 
          size={32}
        />
        {errors.rating && (
          <p className="text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Comentario (Opcional)
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          placeholder="¿Qué te pareció el producto?"
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Publicar Reseña
      </Button>
    </form>
  );
}
