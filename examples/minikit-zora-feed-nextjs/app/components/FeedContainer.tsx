"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { FeedGrid, type FeedItem } from "@embed-ai/react/feed";
import { useFeedData } from "../hooks/useFeedData";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import { CustomFeedCard } from "./CustomFeedCard";

interface FeedContainerProps {
  title?: string;
  feedId?: string;
}

export function FeedContainer({ title = "Your Feed", feedId }: FeedContainerProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefreshing,
  } = useFeedData({ feedId });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const openUrl = useOpenUrl();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isEmpty = !data || data.length === 0;

  // MiniKit actions
  const handleShare = (item: FeedItem) => {
    const { author } = item.metadata;
    const url = `https://warpcast.com/${author.username}/${item.item_id}`;
    
    // Use openUrl to share for now - in a real app you'd use compose cast
    openUrl(url);
  };

  const handleReply = (item: FeedItem) => {
    const url = `https://warpcast.com/${item.metadata.author.username}/${item.item_id}`;
    openUrl(url);
  };

  const handleViewProfile = (item: FeedItem) => {
    const { author } = item.metadata;
    const url = `https://warpcast.com/${author.username}`;
    openUrl(url);
  };

  const handleTip = (item: FeedItem) => {
    // For now, just open the profile - in a real app you'd use sendToken
    const { author } = item.metadata;
    const url = `https://warpcast.com/${author.username}`;
    openUrl(url);
  };

  return (
    <div className="w-full max-w-full overflow-hidden feed-container">
      <FeedGrid
        title={title}
        isLoading={isLoading}
        error={error}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onRefresh={refetch}
        isRefreshing={isRefreshing}
        loaderRef={ref}
        isEmpty={isEmpty}
      >
      {data &&
        data.map((item) => (
          <CustomFeedCard
            key={item.item_id}
            item={item}
            onShare={() => handleShare(item)}
            onReply={() => handleReply(item)}
            onViewProfile={() => handleViewProfile(item)}
            onTip={() => handleTip(item)}
          />
        ))}
      </FeedGrid>
    </div>
  );
}