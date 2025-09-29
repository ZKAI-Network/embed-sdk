import { IconCoin, IconHeart, IconMessageCircle, IconRepeat, IconShare, IconUser } from "@tabler/icons-react"
import { type ReactNode, useMemo, useState } from "react"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	CardContent,
} from "../index.js";
import { EmbedRenderer } from "./EmbedRenderer.js";
import type { FeedItem } from "./types.js";

export interface FeedCardRenderProps {
	item: FeedItem;
}

interface FeedCardProps {
  item: FeedItem
  onReply?: () => void
  onShare?: () => void
  onTip?: () => void
  onViewProfile?: () => void
  render?: (args: FeedCardRenderProps) => ReactNode;
}

export function FeedCard({ item, onReply, onShare, onTip, onViewProfile, render }: FeedCardProps) {
  const { author, comments_count, embed_items, likes_count, shares_count, text } = item.metadata

  const [isExpanded, setIsExpanded] = useState(false)

  const { displayText, isLongText } = useMemo(() => {
    const longText = text ? text.length > 300 : false
    const display = longText && !isExpanded ? text.slice(0, 300) : text
    return { displayText: display, isLongText: longText }
  }, [text, isExpanded])
 
  if (render) {
    return render({ item })
  }

  return (
    <Card className="border rounded-lg shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full space-y-4">
        {/* Author Info */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onViewProfile}
        >
          <Avatar className="w-12 h-12 ring-1 ring-border">
            <AvatarImage src={author.pfp_url} alt={author.display_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {author.display_name
                ? author.display_name.charAt(0).toUpperCase()
                : <IconUser size={20} />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm line-clamp-1">
              {author.display_name}
            </p>
            <p className="text-muted-foreground text-xs">@{author.username}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <p className="text-sm flex-1 leading-6 break-words">
            {displayText}
            {isLongText && !isExpanded && (
              <>
                {"... "}
                <span
                  onClick={() => setIsExpanded(true)}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                  role="button"
                >
                  Show more
                </span>
              </>
            )}
          </p>
          {isLongText && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-primary text-sm font-semibold mt-2 hover:underline cursor-pointer"
            >
              Show less
            </button>
          )}
        </div>

        {/* Embeds */}
        {embed_items && embed_items.length > 0 && (
          <EmbedRenderer embed_items={embed_items} />
        )}

        {/* Engagement Stats */}
        <div className="flex justify-between items-center mt-auto pt-4">
          <div
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors cursor-pointer"
            onClick={onReply}
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
            className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors cursor-pointer"
            onClick={onShare}
          >
            <IconShare size={14} color="#6b7280" />
          </div>

          <div
            className="flex items-center gap-2 text-muted-foreground hover:text-purple-500 transition-colors cursor-pointer"
            onClick={onTip}
          >
            <IconCoin size={14} color="#eab308" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
