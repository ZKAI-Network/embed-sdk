import { Group, Title, Badge } from "@mantine/core";

interface FeedHeaderProps {
  timestamp?: string;
}

export function FeedHeader({ timestamp }: FeedHeaderProps) {
  return (
    <Group justify="space-between" align="center">
      <Title order={1} size="h2" c="blue">
        Embed personalized feed
      </Title>
      {timestamp && (
        <Badge variant="light" color="green" size="md">
          Updated: {timestamp}
        </Badge>
      )}
    </Group>
  );
} 
