import React from "react";
import { Button } from "./Button.js";
import { EmptyState } from "./EmptyState.js";
import { ErrorState } from "./ErrorState.js";
import { Loader } from "./Loader.js";
import { LoadingSkeleton } from "./LoadingSkeleton.js";

interface FeedGridProps {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
  error?: { message: string } | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  loaderRef: (node?: Element | null | undefined) => void;
  isEmpty: boolean;
}

export function FeedGrid({
  title,
  children,
  isLoading,
  error,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
  isRefreshing,
  loaderRef,
  isEmpty,
}: FeedGridProps) {
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
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Feed Cards */}
      {!isEmpty && (
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {children}
          </div>
        </div>
      )}

      {/* Intersection Observer Trigger: only rendered when we can fetch more */}
      {hasNextPage && !isFetchingNextPage && <div ref={loaderRef} />}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !isLoading && <EmptyState />}
    </div>
  );
}
