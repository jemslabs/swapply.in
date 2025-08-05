import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function ItemSkeleton() {
  return (
    <Card className="p-0 flex flex-col h-[400px] animate-pulse">
      {/* Image Skeleton */}
      <div>
        <Skeleton className="h-40 w-full rounded-xl bg-zinc-600" />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="p-3 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded bg-zinc-600" />
          {/* Company */}
          <Skeleton className="h-3 w-1/2 rounded bg-zinc-600" />
          {/* Description */}
          <Skeleton className="h-3 w-full rounded bg-zinc-600" />
          <Skeleton className="h-3 w-5/6 rounded bg-zinc-600" />
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-16 rounded bg-zinc-600" />
            <Skeleton className="h-3 w-12 rounded bg-zinc-600" />
            <Skeleton className="h-4 w-14 rounded bg-zinc-600" />
          </div>
        </div>

        {/* Button */}
        <div className="px-3 pb-3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </Card>
  );
}
