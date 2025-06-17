import { useEffect, useState } from "react";
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
}

export function useFeedData(): UseFeedDataReturn {
  const { isSDKLoaded, isRunningOnFrame, context } = useFrame();
  const [timestamp, setTimestamp] = useState("");

  const fidToUse = (isRunningOnFrame && context?.user?.fid) || 3;

  const {
    data: forYouData,
    isLoading: forYouLoading,
    error: forYouError,
  } = trpc.forYouFeed.useQuery(
    { fid: fidToUse! },
    { enabled: !!fidToUse && isSDKLoaded }
  );

  useEffect(() => {
    if (forYouData) {
      setTimestamp(new Date().toLocaleTimeString());
    }
  }, [forYouData]);

  return {
    data: forYouData?.body as FeedItem[] | undefined,
    isLoading: forYouLoading,
    error: forYouError,
    fidToUse,
    timestamp,
    isRunningOnFrame,
    isSDKLoaded,
    userInfo: context?.user ? {
      fid: context.user.fid,
      displayName: context.user.displayName,
      username: context.user.username,
      pfpUrl: context.user.pfpUrl,
    } : undefined,
  };
} 
