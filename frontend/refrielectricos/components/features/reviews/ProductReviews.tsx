'use client';

import { useEffect, useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { ReviewsList } from './ReviewsList';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const user = useAuthStore((state) => state.user);
  const [canReview, setCanReview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // To force refresh list after submission

  useEffect(() => {
    if (!user) {
      return;
    }

    const checkEligibility = async () => {
      try {
        const { data } = await api.get<{ canReview: boolean }>(
          `/reviews/eligibility/${productId}`,
        );
        setCanReview(data.canReview);
      } catch (error) {
        console.error('Error checking review eligibility:', error);
        setCanReview(false);
      }
    };

    checkEligibility();
  }, [user, productId, refreshKey]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setCanReview(false); // Hide form after submission
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Opiniones de clientes</h2>
      
      {canReview && (
        <div className="mb-8">
          <ReviewForm productId={productId} onSuccess={handleSuccess} />
        </div>
      )}

      <ReviewsList key={refreshKey} productId={productId} />
    </div>
  );
}
