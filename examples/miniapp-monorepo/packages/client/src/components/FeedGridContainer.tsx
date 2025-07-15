import { useInView } from "react-intersection-observer"
import { useEffect, useState, useCallback } from "react"
import { FeedGrid, FeedCard, type FeedItem, type OgDataState } from "@embed-ai/react"
import { useFrame } from "../FrameProvider"
import { OgDataFetcher } from "./OgDataFetcher"



interface FeedGridContainerProps {
  title: string;
  data?: FeedItem[];
  isLoading: boolean;
  error?: { message: string } | null;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function FeedGridContainer({
  title,
  data,
  isLoading,
  error,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
  isRefreshing,
}: FeedGridContainerProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { actions: { composeCast, viewProfile, sendToken } } = useFrame()
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({})
  const [ogDataMap, setOgDataMap] = useState<Record<string, OgDataState>>({})

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleOgData = useCallback((url: string, ogState: OgDataState) => {
    setOgDataMap(prev => ({ ...prev, [url]: ogState }))
  }, [setOgDataMap])

  const uniqueUrls = data
    ? [...new Set(data.flatMap((item) => item.metadata.embed_items || []))]
    : []

  const isEmpty = !data || data.length === 0;

  return (
    <FeedGrid
      title={title}
      isLoading={isLoading}
      error={error}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      loaderRef={ref}
      isEmpty={isEmpty}
    >
      {/* Render fetchers for each unique URL */}
      {uniqueUrls.map((url) => (
        <OgDataFetcher
          key={url}
          url={url}
          onData={handleOgData}
        />
      ))}

      {data &&
        data.map((item) => {
        const { author, text } = item.metadata;
        const isExpanded = expandedState[item.item_id] || false;

        const isLongText = text ? text.length > 300 : false;
        const displayText = isLongText && !isExpanded ? text.slice(0, 300) : text;

        const handleShare = () => {
          composeCast({
            text: `I found this interesting cast from @${author.username} in the Embed Mini App`,
            embeds: [`https://warpcast.com/${author.username}/${item.item_id}`],
          });
        };

        const handleReply = () => {
          composeCast({
            text: "Interesting! By the way, I found your cast on Embed Mini App #shamelessPlug",
            parent: { type: "cast", hash: item.item_id },
          });
        };

        const handleViewProfile = () => {
          viewProfile({ fid: author.fid });
        };

        const handleTip = () => {
          sendToken({
            token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            amount: "1000000",
            recipientFid: author.fid,
          });
        };

        const handleSetIsExpanded = (expanded: boolean) => {
          setExpandedState(prev => ({ ...prev, [item.item_id]: expanded }));
        };

        return (
          <FeedCard
            key={item.item_id}
            item={item}
            isExpanded={isExpanded}
            setIsExpanded={handleSetIsExpanded}
            displayText={displayText}
            isLongText={isLongText}
            onShare={handleShare}
            onReply={handleReply}
            onViewProfile={handleViewProfile}
            onTip={handleTip}
            ogDataMap={ogDataMap}
          />
        )
      })}
    </FeedGrid>
  );
}
