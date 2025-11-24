'use client';

import { useEffect, useState } from 'react';
import { StarRating } from './StarRating';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
}

interface ReviewsListProps {
  productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get<Review[]>(
          `/reviews/product/${productId}`,
        );
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />
      ))}
    </div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay reseñas todavía. ¡Sé el primero en opinar!
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <StarRating value={averageRating} readOnly size={24} />
          <p className="text-sm text-gray-500 mt-1">{reviews.length} reseñas</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {review.user.name || 'Usuario'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
              </span>
            </div>
            <StarRating value={review.rating} readOnly size={16} />
            {review.comment && (
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
