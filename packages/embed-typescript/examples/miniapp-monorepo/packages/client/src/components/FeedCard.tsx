import { Card, Stack, Group, Avatar, Text } from "@mantine/core";
import {
  IconMessageCircle,
  IconHeart,
  IconRepeat,
  IconShare,
  IconUser,
} from "@tabler/icons-react";

interface Author {
  pfp_url: string;
  display_name: string;
  username: string;
}

interface FeedItemMetadata {
  author: Author;
  text: string;
  comments_count?: number;
  shares_count?: number;
  likes_count?: number;
}

interface FeedItem {
  item_id: string;
  metadata: FeedItemMetadata;
}

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  const { author, text, comments_count, shares_count, likes_count } = item.metadata;

  return (
    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "100%" }}>
      <Stack gap="md" style={{ height: "100%" }}>
        {/* Author Info */}
        <Group gap="sm" align="center">
          <Avatar
            src={author.pfp_url}
            alt={author.display_name}
            radius="xl"
            size="lg"
          >
            <IconUser size={24} />
          </Avatar>
          <Stack gap={2} style={{ flex: 1 }}>
            <Text fw={600} size="sm" lineClamp={1}>
              {author.display_name}
            </Text>
            <Text c="dimmed" size="xs">
              @{author.username}
            </Text>
          </Stack>
        </Group>

        {/* Content */}
        <Text size="sm" style={{ flex: 1, lineHeight: 1.5 }}>
          {text}
        </Text>

        {/* Engagement Stats */}
        <Group justify="space-between" mt="auto" pt="md">
          <Group gap="xs" align="center">
            <IconMessageCircle size={14} color="var(--mantine-color-blue-6)" />
            <Text size="xs" c="dimmed">
              {comments_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconRepeat size={14} color="var(--mantine-color-green-6)" />
            <Text size="xs" c="dimmed">
              {shares_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconHeart size={14} color="var(--mantine-color-red-6)" />
            <Text size="xs" c="dimmed">
              {likes_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconShare size={14} color="var(--mantine-color-gray-6)" />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

export type { FeedItem, FeedItemMetadata, Author }; 
