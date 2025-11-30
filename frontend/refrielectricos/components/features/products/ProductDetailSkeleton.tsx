import { Skeleton } from "@/components/ui/Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md shrink-0" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex flex-col h-full">
            <Skeleton className="h-10 w-3/4 mb-4" /> {/* Title */}
            
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-5 w-32" /> {/* Rating */}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-10 w-40" /> {/* Price */}
              <Skeleton className="h-6 w-24 rounded-full" /> {/* Stock badge */}
            </div>

            {/* Short Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 flex-1 rounded-lg" /> {/* Add to Cart */}
                <Skeleton className="h-12 flex-1 rounded-lg" /> {/* Buy Now */}
              </div>
              
              <Skeleton className="h-10 w-full rounded-lg" /> {/* Wishlist */}

              {/* Payment Methods */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <Skeleton className="h-4 w-40 mb-3" />
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-12 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
