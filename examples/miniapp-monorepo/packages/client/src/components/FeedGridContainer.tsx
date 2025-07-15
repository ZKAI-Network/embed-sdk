import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { FeedGrid, FeedCard, type FeedItem } from "@embed-ai/react"
import { useFrame } from "../FrameProvider"


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
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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
      {data &&
        data.map((item) => {
        const { author } = item.metadata;

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

        return (
          <FeedCard
            key={item.item_id}
            item={item}
            onShare={handleShare}
            onReply={handleReply}
            onViewProfile={handleViewProfile}
            onTip={handleTip}
          />
        )
      })}
    </FeedGrid>
  );
}
