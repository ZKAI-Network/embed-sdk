import { Card, CardContent, Skeleton } from "@embed-ai/react";

export function LoadingSkeleton() {
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[90%]" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-8" />
        </div>
      </CardContent>
    </Card>
  );
} 
