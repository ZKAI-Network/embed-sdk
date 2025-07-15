import { Card, CardContent } from "./card.js"
import { Skeleton } from "./skeleton.js"

export function EmbedSkeleton() {
  return (
    <Card className="border rounded-md">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Left side - Image/Icon skeleton */}
          <Skeleton className="w-20 h-20 rounded-sm flex-shrink-0" />
          {/* Right side - Text content skeleton */}
          <div className="flex-1 min-w-0">
            {/* Title line */}
            <Skeleton className="h-4 w-3/4 mb-2" />
            {/* Description lines */}
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-4/5 mb-2" />
            {/* URL/Domain line */}
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
