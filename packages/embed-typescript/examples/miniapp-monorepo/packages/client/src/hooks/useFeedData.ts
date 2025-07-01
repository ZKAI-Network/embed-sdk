import { useEffect, useState, useCallback, useRef } from "react";
import { useFrame } from "../FrameProvider";
import { trpc } from "../trpc";
import type { FeedItem } from "../components/FeedCard";

export interface UseFeedDataReturn {
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fidToUse?: number;
  customFid?: number;
  setFid: (fid?: number) => void;
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
  refetch: () => Promise<any>;
  isRefreshing: boolean;
}

export function useFeedData(
  options: {
    fetchDefault?: boolean;
    feedId?: string;
  } = {},
): UseFeedDataReturn {
  const { fetchDefault = true, feedId } = options;
  const { isSDKLoaded, isRunningOnFrame, context } = useFrame();
  const [timestamp, setTimestamp] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [customFid, setCustomFid] = useState<number>();
  const prevFeedIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Reset pages when feedId changes
    if (prevFeedIdRef.current !== feedId) {
      setPages([]);
      setHasNextPage(true);
    }
    prevFeedIdRef.current = feedId;
  }, [feedId]);

  const fidToUse =
    customFid ??
    (fetchDefault ? (isRunningOnFrame && context?.user?.fid) || 3 : undefined);

  const {
    data: forYouData,
    isLoading: forYouLoading,
    error: forYouError,
    refetch: triggerQuery,
    isRefetching: isRefreshing,
  } = trpc.forYouFeed.useQuery(
    { fid: fidToUse!, ...(feedId && { feed_id: feedId }) },
    {
      enabled: !!fidToUse && isSDKLoaded && pages.length === 0,
    } // Only fetch automatically on first load
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

  const setFid = useCallback((fid?: number) => {
    setCustomFid(fid);
    setPages([]);
    setHasNextPage(true);
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !fidToUse) return;

    setIsFetchingNextPage(true);
    try {
      const nextPageData = await triggerQuery();
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
  }, [isFetchingNextPage, hasNextPage, triggerQuery, fidToUse]);

  const refetch = useCallback(async () => {
    if (!fidToUse) return;
    const result = await triggerQuery();
    if (result.data) {
      setPages([result.data]); // Reset pages with new data
      setTimestamp(new Date().toLocaleTimeString());
      setHasNextPage(result.data.body.length > 0);
    }
    return result;
  }, [triggerQuery, fidToUse]);

  const flattenedData = pages.flatMap((page) =>
    (page.body as any[]).map((item) => ({
      ...item,
      metadata: {
        ...item.metadata,
        author: {
          ...item.metadata.author,
          fid: item.metadata.author.user_id,
        },
      },
    }))
  );

  return {
    data: flattenedData,
    isLoading: forYouLoading && pages.length === 0,
    error: forYouError,
    fidToUse,
    customFid,
    setFid,
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
    refetch,
    isRefreshing,
  };
} 
