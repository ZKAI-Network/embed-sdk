import React from "react"
import { Button } from "./button.js"
import { EmptyState } from "./EmptyState.js"
import { ErrorState } from "./ErrorState.js"
import { Loader } from "./loader.js"
import { LoadingSkeleton } from "./LoadingSkeleton.js"

interface FeedGridProps {
  children: React.ReactNode
  error?: { message: string } | null
  hasNextPage: boolean
  isEmpty: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  isRefreshing: boolean
  loaderRef: (node?: Element | null | undefined) => void
  onRefresh: () => void
  title?: string
}

export function FeedGrid({
  children,
  error,
  hasNextPage,
  isEmpty,
  isFetchingNextPage,
  isLoading,
  isRefreshing,
  loaderRef,
  onRefresh,
  title,
}: FeedGridProps) {
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg text-muted-foreground">{title}</h3>
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
      )}

      {/* Error State */}
      {error && <ErrorState message={error.message} />}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 8 }).map((_, index) => <LoadingSkeleton key={index} />)}
          </div>
        </div>
      )}

      {/* Feed Cards */}
      {!isEmpty && (
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">{children}</div>
        </div>
      )}

      {/* Intersection Observer Trigger: only rendered when we can fetch more */}
      {hasNextPage && !isFetchingNextPage && <div ref={loaderRef} />}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="w-full sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => <LoadingSkeleton key={index} />)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !isLoading && <EmptyState />}
    </div>
  )
}
