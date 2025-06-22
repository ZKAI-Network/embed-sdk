import { SimpleGrid, Stack, Group, Title, Loader, Button } from "@mantine/core";
import { FeedCard, type FeedItem } from "./FeedCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface FeedGridProps {
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fidToUse: number;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function FeedGrid({
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
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3} c="dimmed">
          For You Feed
        </Title>
        <Group>
          <Button onClick={onRefresh} loading={isRefreshing} variant="light" size="xs">
            Refresh
          </Button>
          {isLoading && <Loader size="sm" />}
        </Group>
      </Group>

      {/* Error State */}
      {error && <ErrorState message={error.message} />}

      {/* Loading State */}
      {isLoading && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="md"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </SimpleGrid>
      )}

      {/* Feed Cards */}
      {data && data.length > 0 && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="md"
        >
          {data.map((item) => (
            <FeedCard key={item.item_id} item={item} />
          ))}
        </SimpleGrid>
      )}

      {/* Intersection Observer Trigger: only rendered when we can fetch more */}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="md"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </SimpleGrid>
      )}

      {/* Empty State */}
      {data && data.length === 0 && !isLoading && <EmptyState />}
    </Stack>
  );
} 
