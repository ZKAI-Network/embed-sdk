import { Card, Stack, Group, Avatar, Text, Image } from "@mantine/core";
import {
  IconMessageCircle,
  IconHeart,
  IconRepeat,
  IconShare,
  IconUser,
  IconCoin,
} from "@tabler/icons-react";
import { useFrame } from "../FrameProvider";
import { UrlEmbed } from "./UrlEmbed";

interface Author {
  pfp_url: string;
  display_name: string;
  username: string;
  fid: number;
}

interface FeedItemMetadata {
  author: Author;
  text: string;
  comments_count?: number;
  shares_count?: number;
  likes_count?: number;
  embed_items?: string[];
}

interface FeedItem {
  item_id: string;
  metadata: FeedItemMetadata;
}

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  const { author, text, comments_count, shares_count, likes_count, embed_items } =
    item.metadata;
  const {
    actions: { composeCast, viewProfile, sendToken },
  } = useFrame();

  const handleShare = () => {
    composeCast({
      text: `I found this interesting cast from @${author.username} in the Embed Mini App`,
      embeds: [`https://warpcast.com/${author.username}/${item.item_id}`],
    });
  };

  const handleReply = () => {
    composeCast({
      text: "Interesting! By the way, I found your cast on Embed Mini App #shamelessPlug",
      parent: { type: "cast", hash: item.item_id },
    });
  };

  const handleViewProfile = () => {
    viewProfile({ fid: author.fid });
  };

  const handleTip = () => {
    sendToken({
      token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      amount: "1000000",
      recipientFid: author.fid,
    });
  };

  return (
    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "100%" }}>
      <Stack gap="md" style={{ height: "100%" }}>
        {/* Author Info */}
        <Group
          gap="sm"
          align="center"
          onClick={handleViewProfile}
          style={{ cursor: "pointer" }}
        >
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

        {/* Embeds */}
        {embed_items && embed_items.length > 0 && (
          <Stack gap="sm" pt="sm">
            {embed_items.map((embed, index) => {
              if (
                /\.(jpeg|jpg|gif|png|webp)$/i.test(embed) ||
                embed.includes("imagedelivery.net") ||
                embed.includes("/ipfs/") // not all ipfs files are images, this is sample app only and these cases should be better supported
              ) {
                return (
                  <Image
                    key={index}
                    src={embed}
                    radius="md"
                    alt="embedded content"
                  />
                );
              }
              if (embed.includes("stream.farcaster.xyz")) {
                return (
                  <Text
                    key={index}
                    size="sm"
                    component="a"
                    href={embed}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View media
                  </Text>
                );
              }
              return <UrlEmbed key={index} url={embed} />;
            })}
          </Stack>
        )}

        {/* Engagement Stats */}
        <Group justify="space-between" mt="auto" pt="md">
          <Group
            gap="xs"
            align="center"
            onClick={handleReply}
            style={{ cursor: "pointer" }}
          >
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
          
          <Group
            gap="xs"
            align="center"
            onClick={handleShare}
            style={{ cursor: "pointer" }}
          >
            <IconShare size={14} color="var(--mantine-color-gray-6)" />
          </Group>

          <Group
            gap="xs"
            align="center"
            onClick={handleTip}
            style={{ cursor: "pointer" }}
          >
            <IconCoin size={14} color="var(--mantine-color-yellow-6)" />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

export type { FeedItem, FeedItemMetadata, Author }; 
