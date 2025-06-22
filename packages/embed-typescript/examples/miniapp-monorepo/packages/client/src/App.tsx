import { Alert, Stack, Container, Group, Avatar, Text, Loader } from "@mantine/core";
import { FeedHeader, FeedGrid } from "./components";
import { useFeedData } from "./hooks";
import { usePullToRefresh } from "./hooks/usePullToRefresh";

function App() {
  const {
    data,
    isLoading,
    error,
    fidToUse,
    timestamp,
    isRunningOnFrame,
    isSDKLoaded,
    userInfo,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefreshing: isDataRefreshing,
  } = useFeedData();

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
                data={data}
                isLoading={isLoading}
                error={error}
                fidToUse={fidToUse}
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

export default App; 
