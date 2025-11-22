import { Skeleton } from "@/components/ui/Skeleton"
import Card from "@/components/ui/Card"

export default function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative w-full pt-[70%] bg-gray-100 dark:bg-gray-800">
        <Skeleton className="absolute inset-0 m-4" />
      </div>
      <div className="p-4 flex flex-col grow gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-auto pt-4">
          <Skeleton className="h-8 w-1/3 mb-3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Card>
  )
}
