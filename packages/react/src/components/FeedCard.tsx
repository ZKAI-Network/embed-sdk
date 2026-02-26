import { type ReactNode } from "react"

import { Card, CardContent } from "../index.js"
import type { FeedItem, PolymarketFeedItem } from "./types.js"
import { FarcasterFeedCard } from "./FarcasterFeedCard.js"
import { PolymarketFeedCard } from "./PolymarketFeedCard.js"

export interface FeedCardRenderProps {
  item: FeedItem | PolymarketFeedItem
}

export interface FeedCardProps {
  item: FeedItem | PolymarketFeedItem
  onReply?: () => void
  onShare?: () => void
  onTip?: () => void
  onViewProfile?: () => void
  render?: (args: FeedCardRenderProps) => ReactNode
}

export function FeedCard({ item, onReply, onShare, onTip, onViewProfile, render }: FeedCardProps) {
  const { item_id } = item

  if (render) {
    return render({ item })
  }

  if (item.source === "farcaster") {
    return (
      <FarcasterFeedCard
        item={item}
        onReply={onReply}
        onShare={onShare}
        onTip={onTip}
        onViewProfile={onViewProfile}
      />
    )
  }

  if (item.source === "polymarket") {
    return <PolymarketFeedCard item={item} />
  }

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">Source not supported</p>
        <p className="text-xs text-muted-foreground mt-1">{item_id}</p>
      </CardContent>
    </Card>
  )
}
