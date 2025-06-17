import { SimpleGrid, Stack, Group, Title, Loader } from "@mantine/core";
import { FeedCard, type FeedItem } from "./FeedCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";

interface FeedGridProps {
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fidToUse: number;
}

export function FeedGrid({ data, isLoading, error, fidToUse }: FeedGridProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3} c="dimmed">
          For You Feed • FID: {fidToUse}
        </Title>
        {isLoading && <Loader size="sm" />}
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

      {/* Empty State */}
      {data && data.length === 0 && <EmptyState />}
    </Stack>
  );
} 
