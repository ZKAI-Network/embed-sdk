import { useFrame } from "./FrameProvider";
import { trpc } from "./trpc";
import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Text,
  Group,
  Avatar,
  Stack,
  Container,
  Title,
  Badge,
  Skeleton,
  SimpleGrid,
  Paper,
  Center,
  Loader,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconHeart,
  IconRepeat,
  IconShare,
  IconUser,
} from "@tabler/icons-react";

function App() {
  const { isSDKLoaded, isRunningOnFrame, context } = useFrame();

  const fidToUse =
    (isRunningOnFrame && (context as any)?.client?.requester?.fid) || 3;

  const {
    data: forYouData,
    isLoading: forYouLoading,
    error: forYouError,
  } = trpc.forYouFeed.useQuery(
    { fid: fidToUse! },
    { enabled: !!fidToUse && isSDKLoaded }
  );

  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    if (forYouData) {
      setTimestamp(new Date().toLocaleTimeString());
    }
  }, [forYouData]);

  const LoadingSkeleton = () => (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      <Stack gap="md">
        <Group gap="sm">
          <Skeleton height={50} circle />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={16} width="40%" />
            <Skeleton height={12} width="30%" />
          </Stack>
        </Group>
        <Stack gap="xs">
          <Skeleton height={14} />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
        </Stack>
        <Group justify="space-between" mt="md">
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={30} />
        </Group>
      </Stack>
    </Card>
  );

  const FeedCard = ({ item }: { item: any }) => (
    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "100%" }}>
      <Stack gap="md" style={{ height: "100%" }}>
        {/* Author Info */}
        <Group gap="sm" align="center">
          <Avatar
            src={item.metadata.author.pfp_url}
            alt={item.metadata.author.display_name}
            radius="xl"
            size="lg"
          >
            <IconUser size={24} />
          </Avatar>
          <Stack gap={2} style={{ flex: 1 }}>
            <Text fw={600} size="sm" lineClamp={1}>
              {item.metadata.author.display_name}
            </Text>
            <Text c="dimmed" size="xs">
              @{item.metadata.author.username}
            </Text>
          </Stack>
        </Group>

        {/* Content */}
        <Text size="sm" style={{ flex: 1, lineHeight: 1.5 }}>
          {item.metadata.text}
        </Text>

        {/* Engagement Stats */}
        <Group justify="space-between" mt="auto" pt="md">
          <Group gap="xs" align="center">
            <IconMessageCircle size={14} color="var(--mantine-color-blue-6)" />
            <Text size="xs" c="dimmed">
              {item.metadata.comments_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconRepeat size={14} color="var(--mantine-color-green-6)" />
            <Text size="xs" c="dimmed">
              {item.metadata.shares_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconHeart size={14} color="var(--mantine-color-red-6)" />
            <Text size="xs" c="dimmed">
              {item.metadata.likes_count || 0}
            </Text>
          </Group>
          
          <Group gap="xs" align="center">
            <IconShare size={14} color="var(--mantine-color-gray-6)" />
          </Group>
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container size="xl" px="md" py="xl">
      <Stack gap="xl">
        {/* Header */}
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
        
        {!isRunningOnFrame && (
          <Alert 
            title="Demo Mode" 
            color="blue" 
            variant="light"
          >
            This is a demo feed. Run in a Farcaster frame for personalized content.
          </Alert>
        )}

        {/* Feed Content */}
        {isSDKLoaded && (
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3} c="dimmed">
                For You Feed • FID: {fidToUse}
              </Title>
              {forYouLoading && <Loader size="sm" />}
            </Group>

            {/* Error State */}
            {forYouError && (
              <Card withBorder p="xl" radius="md" bg="red.0">
                <Center>
                  <Stack align="center" gap="sm">
                    <Text c="red" fw={500}>
                      Error loading feed
                    </Text>
                    <Text c="red" size="sm">
                      {forYouError.message}
                    </Text>
                  </Stack>
                </Center>
              </Card>
            )}

            {/* Loading State */}
            {forYouLoading && (
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
            {forYouData?.body && forYouData.body.length > 0 && (
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing="md"
              >
                {forYouData.body.map((item: any) => (
                  <FeedCard key={item.item_id} item={item} />
                ))}
              </SimpleGrid>
            )}

            {/* Empty State */}
            {forYouData?.body && forYouData.body.length === 0 && (
              <Card withBorder p="xl" radius="md">
                <Center>
                  <Stack align="center" gap="sm">
                    <Text c="dimmed" fw={500}>
                      No posts available
                    </Text>
                    <Text c="dimmed" size="sm">
                      Check back later for new content
                    </Text>
                  </Stack>
                </Center>
              </Card>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default App; 
