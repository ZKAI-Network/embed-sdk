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
  SimpleGrid,
  Skeleton,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconMessageCircle,
  IconHeart,
  IconRepeat,
} from "@tabler/icons-react";

function App() {
  const { isSDKLoaded, isRunningOnFrame, context } = useFrame();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const fidToUse = (isRunningOnFrame && (context as any)?.client?.requester?.fid) || 3;

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

  return (
    <Container size="xs" p={isMobile ? "xs" : "md"}>
      <Stack align="center" mt="md">
        <Title order={2}>Embed Feed</Title>

        {!isRunningOnFrame && (
            <Alert title="Not in a Farcaster Frame" color="blue" mt="md">
                Please run this app in a Farcaster frame to see your personalized feed. Defaulting to a generic feed for now.
            </Alert>
        )}

        {isSDKLoaded && (
          <Stack mt="md" gap="lg" w="100%">
            <Title order={4} c="dimmed" style={{ textAlign: 'center' }}>
              For You Feed for FID: {fidToUse}{" "}
              {timestamp && (
                <Badge variant="outline">Updated: {timestamp}</Badge>
              )}
            </Title>
            {forYouError && (
              <Card shadow="sm" p={{ base: 'sm', sm: 'lg' }} withBorder>
                <Text c="red">Error loading feed: {forYouError.message}</Text>
              </Card>
            )}
            
                {forYouLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                    <Card shadow="sm" p={isMobile ? "sm" : "lg"} withBorder key={index} radius="md">
                        <Group wrap="nowrap" align="flex-start">
                            <Skeleton height={40} circle />
                            <Stack gap="xs" w="100%">
                                <Group>
                                    <Skeleton height={16} width={120} />
                                    <Skeleton height={14} width={80} />
                                </Group>
                                <Stack gap="xs" mt="sm">
                                    <Skeleton height={14} />
                                    <Skeleton height={14} width="90%" />
                                </Stack>
                                <Group mt="md" gap={isMobile ? "md" : "xl"}>
                                    <Skeleton height={20} width={50}/>
                                    <Skeleton height={20} width={50}/>
                                    <Skeleton height={20} width={50}/>
                                </Group>
                            </Stack>
                        </Group>
                    </Card>
                    ))}

                {forYouData?.body?.map((item: any) => (
                    <Card shadow="sm" p={isMobile ? "sm" : "lg"} withBorder key={item.item_id} radius="md">
                        <Group wrap="nowrap" align="flex-start">
                            <Avatar
                                src={item.metadata.author.pfp_url}
                                alt={item.metadata.author.display_name}
                                radius="xl"
                            />
                            <Stack gap="xs">
                                <Group gap="xs">
                                    <Text fw={500}>
                                    {item.metadata.author.display_name}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                    @{item.metadata.author.username}
                                    </Text>
                                </Group>
                                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                    {item.metadata.text}
                                </Text>
                                <Group mt="md" gap={isMobile ? "md" : "xl"}>
                                    <Group gap={4} align="center">
                                        <IconMessageCircle size={18} color="var(--mantine-color-dimmed)" />
                                        <Text size="sm" c="dimmed">{item.metadata.comments_count}</Text>
                                    </Group>
                                    <Group gap={4} align="center">
                                        <IconHeart size={18} color="var(--mantine-color-dimmed)" />
                                        <Text size="sm" c="dimmed">{item.metadata.likes_count}</Text>
                                    </Group>
                                    <Group gap={4} align="center">
                                        <IconRepeat size={18} color="var(--mantine-color-dimmed)" />
                                        <Text size="sm" c="dimmed">{item.metadata.shares_count}</Text>
                                    </Group>
                                </Group>
                            </Stack>
                        </Group>
                    </Card>
                ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default App;
