import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader } from "../components/ui/loader";
import { FeedHeader, FeedGrid } from "../components";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import type { UseFeedDataReturn } from "../hooks/useFeedData";
import { FEEDS } from "../../../shared/constants/feedIds";
import type { FeedId } from "../../../shared/constants/feedIds";
import type { Dispatch, SetStateAction } from "react";
import { IconUser } from "@tabler/icons-react";

type HomePageProps = UseFeedDataReturn & {
  selectedFeed: FeedId;
  setSelectedFeed: Dispatch<SetStateAction<FeedId>>;
};

export function HomePage(props: HomePageProps) {
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
    selectedFeed,
    setSelectedFeed,
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
        <div className="fixed top-5 left-0 right-0 z-10 flex justify-center py-4">
          <Loader />
        </div>
      )}
      <div ref={containerRef} style={style}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <FeedHeader timestamp={timestamp} />
            
            {/* User Profile Section */}
            {isRunningOnFrame && userInfo && (
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage 
                    src={userInfo.pfpUrl} 
                    alt={userInfo.displayName || userInfo.username} 
                  />
                  <AvatarFallback>
                    <IconUser size={24} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-lg">
                    {userInfo.displayName || userInfo.username}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    @{userInfo.username} • FID: {userInfo.fid}
                  </p>
                </div>
              </div>
            )}
            
            {/* Demo Mode Alert */}
            {!isRunningOnFrame && (
              <Alert>
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                  This is a demo feed. Run in a Farcaster frame for personalized content.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Select a feed</label>
              <Select value={selectedFeed} onValueChange={(value) => setSelectedFeed(value as FeedId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a feed" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDS.map((feed) => (
                    <SelectItem key={feed.id} value={feed.id}>
                      {feed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </div>
      </div>
    </>
  );
} 
