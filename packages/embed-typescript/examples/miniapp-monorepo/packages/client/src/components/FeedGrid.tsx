import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { FeedCard, type FeedItem } from "./FeedCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface FeedGridProps {
  title: string;
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function FeedGrid({
  title,
  data,
  isLoading,
  error,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
  isRefreshing,
}: FeedGridProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-muted-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onRefresh} 
            disabled={isRefreshing} 
            variant="outline" 
            size="sm"
          >
            {isRefreshing && <Loader size="sm" className="mr-2" />}
            Refresh
          </Button>
          {isLoading && <Loader size="sm" />}
        </div>
      </div>

      {/* Error State */}
      {error && <ErrorState message={error.message} />}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Feed Cards */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <FeedCard key={item.item_id} item={item} />
          ))}
        </div>
      )}

      {/* Intersection Observer Trigger: only rendered when we can fetch more */}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {data && data.length === 0 && !isLoading && <EmptyState />}
    </div>
  );
} 
