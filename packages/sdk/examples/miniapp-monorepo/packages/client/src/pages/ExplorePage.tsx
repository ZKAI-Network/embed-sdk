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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <FidSelector
            title="View Someone's Feed"
            isSDKLoaded={isSDKLoaded}
            onSetFid={handleSetFid}
            onResetFid={handleResetFid}
            customFid={customFid}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
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
      </div>
    </div>
  );
} 
