import { useEffect, useState, useCallback } from "react";
import { useFrame } from "../FrameProvider";
import { trpc } from "../trpc";
import type { FeedItem } from "../components/FeedCard";

interface UseFeedDataReturn {
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fidToUse: number;
  timestamp: string;
  isRunningOnFrame: boolean;
  isSDKLoaded: boolean;
  userInfo?: {
    fid: number;
    displayName?: string;
    username?: string;
    pfpUrl?: string;
  };
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export function useFeedData(): UseFeedDataReturn {
  const { isSDKLoaded, isRunningOnFrame, context } = useFrame();
  const [timestamp, setTimestamp] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fidToUse = (isRunningOnFrame && context?.user?.fid) || 3;

  const {
    data: forYouData,
    isLoading: forYouLoading,
    error: forYouError,
    refetch,
  } = trpc.forYouFeed.useQuery(
    { fid: fidToUse! },
    { enabled: !!fidToUse && isSDKLoaded && pages.length === 0 } // Only fetch automatically on first load
  );

  useEffect(() => {
    if (forYouData && pages.length === 0) {
      setPages([forYouData]);
      setTimestamp(new Date().toLocaleTimeString());
      if (forYouData.body.length === 0) {
        setHasNextPage(false);
      }
    }
  }, [forYouData, pages.length]);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const nextPageData = await refetch();
      if (nextPageData.data) {
        setPages((prevPages) => [...prevPages, nextPageData.data]);
        if (nextPageData.data.body.length === 0) {
          setHasNextPage(false);
        }
      }
    } catch (e) {
      console.error("Failed to fetch next page", e);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [isFetchingNextPage, hasNextPage, refetch]);

  const flattenedData = pages.flatMap((page) => page.body as FeedItem[]);

  return {
    data: flattenedData,
    isLoading: forYouLoading && pages.length === 0,
    error: forYouError,
    fidToUse,
    timestamp,
    isRunningOnFrame,
    isSDKLoaded,
    userInfo: context?.user
      ? {
          fid: context.user.fid,
          displayName: context.user.displayName,
          username: context.user.username,
          pfpUrl: context.user.pfpUrl,
        }
      : undefined,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
} 
