import { Stack, Container } from "@mantine/core";
import { FeedGrid, FidSelector } from "../components";
import type { UseFeedDataReturn } from "../hooks/useFeedData";

export function ExplorePage(props: UseFeedDataReturn) {
  const {
    data,
    isLoading,
    error,
    fidToUse,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefreshing: isDataRefreshing,
    setFid,
    customFid,
    isSDKLoaded,
  } = props;

  const handleSetFid = (fid: number) => {
    setFid(fid);
  };

  const handleResetFid = () => {
    setFid(undefined);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const showFeed = isLoading || (data && data.length > 0);

  if (!showFeed) {
    return (
      <Container size="xl" px="md" py="xl">
        <Stack gap="xl">
          <FidSelector
            title="View Someone's Feed"
            isSDKLoaded={isSDKLoaded}
            onSetFid={handleSetFid}
            onResetFid={handleResetFid}
            customFid={customFid}
          />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" px="md" py="xl">
      <Stack gap="xl">
        <FidSelector
          title="View Someone's Feed"
          isSDKLoaded={isSDKLoaded}
          onSetFid={handleSetFid}
          onResetFid={handleResetFid}
          customFid={customFid}
        />
        <FeedGrid
          title={fidToUse ? `Feed for FID: ${fidToUse}` : "Someone's Feed"}
          data={data}
          isLoading={isLoading}
          error={error}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onRefresh={handleRefresh}
          isRefreshing={isDataRefreshing}
        />
      </Stack>
    </Container>
  );
} 
