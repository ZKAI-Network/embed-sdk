import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  IconMessageCircle,
  IconHeart,
  IconRepeat,
  IconShare,
  IconUser,
  IconCoin,
} from "@tabler/icons-react";
import { useFrame } from "../FrameProvider";
import { UrlEmbed } from "./UrlEmbed";

interface Author {
  pfp_url: string;
  display_name: string;
  username: string;
  fid: number;
}

interface FeedItemMetadata {
  author: Author;
  text: string;
  comments_count?: number;
  shares_count?: number;
  likes_count?: number;
  embed_items?: string[];
}

interface FeedItem {
  item_id: string;
  metadata: FeedItemMetadata;
}

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  const { author, text, comments_count, shares_count, likes_count, embed_items } =
    item.metadata;
  const {
    actions: { composeCast, viewProfile, sendToken },
  } = useFrame();

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
    <Card className="border rounded-lg shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full space-y-4">
        {/* Author Info */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleViewProfile}
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={author.pfp_url} alt={author.display_name} />
            <AvatarFallback>
              <IconUser size={24} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm line-clamp-1">
              {author.display_name}
            </p>
            <p className="text-muted-foreground text-xs">
              @{author.username}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm flex-1 leading-6">
          {text}
        </p>

        {/* Embeds */}
        {embed_items && embed_items.length > 0 && (
          <div className="space-y-3 pt-2">
            {embed_items.map((embed, index) => {
              if (
                /\.(jpeg|jpg|gif|png|webp)$/i.test(embed) ||
                embed.includes("imagedelivery.net") ||
                embed.includes("/ipfs/") // not all ipfs files are images, this is sample app only and these cases should be better supported
              ) {
                return (
                  <img
                    key={index}
                    src={embed}
                    className="rounded-md w-full object-cover"
                    alt="embedded content"
                  />
                );
              }
              if (embed.includes("stream.farcaster.xyz")) {
                return (
                  <a
                    key={index}
                    href={embed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View media
                  </a>
                );
              }
              return <UrlEmbed key={index} url={embed} />;
            })}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex justify-between items-center mt-auto pt-4">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleReply}
          >
            <IconMessageCircle size={14} color="#2563eb" />
            <span className="text-xs text-muted-foreground">
              {comments_count || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <IconRepeat size={14} color="#16a34a" />
            <span className="text-xs text-muted-foreground">
              {shares_count || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <IconHeart size={14} color="#dc2626" />
            <span className="text-xs text-muted-foreground">
              {likes_count || 0}
            </span>
          </div>
          
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleShare}
          >
            <IconShare size={14} color="#6b7280" />
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleTip}
          >
            <IconCoin size={14} color="#eab308" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export type { FeedItem, FeedItemMetadata, Author }; 
