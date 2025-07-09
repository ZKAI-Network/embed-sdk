import { Alert, Stack, Container, Group, Avatar, Text, Loader } from "@mantine/core";
import { FeedHeader, FeedGrid } from "../components";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import type { UseFeedDataReturn } from "../hooks/useFeedData";

export function HomePage(props: UseFeedDataReturn) {
  const {
    data,
    isLoading,
    error,
    timestamp,
    isRunningOnFrame,
    isSDKLoaded,
    userInfo,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefreshing: isDataRefreshing,
  } = props;

  const handleRefresh = async () => {
    await refetch();
  };

  const { containerRef, isRefreshing: isPullRefreshing, style } = usePullToRefresh({
    onRefresh: handleRefresh,
    isDisabled: !isSDKLoaded || isLoading || isDataRefreshing,
  });

  return (
    <>
      {isPullRefreshing && (
        <Group justify="center" py="md" style={{ position: 'fixed', top: '20px', left: 0, right: 0, zIndex: 10 }}>
          <Loader />
        </Group>
      )}
      <div ref={containerRef} style={style}>
        <Container size="xl" px="md" py="xl">
          <Stack gap="xl">
            {/* Header */}
            <FeedHeader timestamp={timestamp} />
            
            {/* User Profile Section */}
            {isRunningOnFrame && userInfo && (
              <Group gap="md" p="md" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                <Avatar 
                  src={userInfo.pfpUrl} 
                  alt={userInfo.displayName || userInfo.username} 
                  size="lg" 
                />
                <div>
                  <Text fw={500} size="lg">
                    {userInfo.displayName || userInfo.username}
                  </Text>
                  <Text size="sm" c="dimmed">
                    @{userInfo.username} • FID: {userInfo.fid}
                  </Text>
                </div>
              </Group>
            )}
            
            {/* Demo Mode Alert */}
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
              <FeedGrid
                title={isRunningOnFrame && userInfo ? `For you, @${userInfo.username}`: "For you (demo)"}
                data={data}
                isLoading={isLoading}
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                onRefresh={handleRefresh}
                isRefreshing={isDataRefreshing}
              />
            )}
          </Stack>
        </Container>
      </div>
    </>
  );
} 
