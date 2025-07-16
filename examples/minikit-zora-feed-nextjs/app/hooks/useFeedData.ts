import { useCallback, useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import type { FeedItem } from "@embed-ai/react/feed";

export interface UseFeedDataReturn {
  data?: Array<FeedItem>;
  isLoading: boolean;
  error?: { message: string } | null;
  fidToUse?: number;
  customFid?: number;
  setFid: (fid?: number) => void;
  timestamp: string;
  isRunningOnFrame: boolean;
  userInfo?: {
    fid: number;
    displayName?: string;
    username?: string;
    pfpUrl?: string;
  };
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refetch: () => Promise<void>;
  isRefreshing: boolean;
}

export function useFeedData(
  options: {
    fetchDefault?: boolean;
    feedId?: string;
  } = {}
): UseFeedDataReturn {
  const { feedId, fetchDefault = true } = options;
  const { context, isFrameReady } = useMiniKit();
  const [data, setData] = useState<Array<FeedItem>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [timestamp, setTimestamp] = useState("");
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [customFid, setCustomFid] = useState<number>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isRunningOnFrame = isFrameReady && !!context;
  const fidToUse = customFid ?? (fetchDefault ? (context?.user?.fid || 3) : undefined);

  const fetchFeedData = useCallback(async (fid: number, feedId?: string) => {
    try {
      const response = await fetch(`/api/feed?fid=${fid}${feedId ? `&feed_id=${feedId}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch feed data:', error);
      throw error;
    }
  }, []);

  const setFid = useCallback((fid?: number) => {
    setCustomFid(fid);
    setData(undefined);
    setHasNextPage(true);
  }, []);

  const refetch = useCallback(async () => {
    if (!fidToUse) return;
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      const result = await fetchFeedData(fidToUse, feedId);
      setData(result);
      setTimestamp(new Date().toLocaleTimeString());
      setHasNextPage(result.length > 0);
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Failed to fetch feed data' });
    } finally {
      setIsRefreshing(false);
    }
  }, [fidToUse, feedId, fetchFeedData]);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !fidToUse) return;

    setIsFetchingNextPage(true);
    try {
      const nextPageData = await fetchFeedData(fidToUse, feedId);
      if (nextPageData.length === 0) {
        setHasNextPage(false);
      } else {
        setData(prev => prev ? [...prev, ...nextPageData] : nextPageData);
      }
    } catch (err) {
      console.error("Failed to fetch next page", err);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [isFetchingNextPage, hasNextPage, fidToUse, feedId, fetchFeedData]);

  // Initial fetch
  useEffect(() => {
    if (fidToUse && !data && !isLoading) {
      setIsLoading(true);
      setError(null);
      
      fetchFeedData(fidToUse, feedId)
        .then(result => {
          setData(result);
          setTimestamp(new Date().toLocaleTimeString());
          setHasNextPage(result.length > 0);
        })
        .catch(err => {
          setError({ message: err instanceof Error ? err.message : 'Failed to fetch feed data' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [fidToUse, feedId, data, isLoading, fetchFeedData]);

  return {
    data,
    isLoading,
    error,
    fidToUse,
    customFid,
    setFid,
    timestamp,
    isRunningOnFrame,
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