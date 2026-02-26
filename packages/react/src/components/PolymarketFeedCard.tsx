import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  cn,
  formatRelativeTime,
} from "../index.js"
import type { PolymarketFeedItem, PolymarketUserStory } from "./types.js"

export interface PolymarketFeedCardProps {
  item: PolymarketFeedItem
  className?: string
}

export function PolymarketFeedCard({ item, className }: PolymarketFeedCardProps) {
  const meta = item.metadata
  const story: PolymarketUserStory =
    Array.isArray(meta.user_stories) && meta.user_stories.length > 0
      ? meta.user_stories[0]
      : {}

  const question = meta.question ?? ""
  const imageUrl = meta.image ?? meta.icon ?? ""
  const active = meta.active === true
  const closed = meta.closed === true
  const volume24hr = meta.volume_24hr != null ? Number(meta.volume_24hr) : 0
  const price24hr = meta.one_day_price_change != null ? Number(meta.one_day_price_change) : 0
  const spread = meta.spread != null ? Number(meta.spread) : 0
  const lastTradePrice = meta.last_trade_price != null ? Number(meta.last_trade_price) : 0.5
  const yesCents = Math.round(lastTradePrice * 100)
  const noCents = Math.round((1 - lastTradePrice) * 100)

  const outcome = story.outcome ?? "Yes"
  const usdc = Number(story.usdc) || 0
  const price = Number(story.price) || 0
  const entryCents = Math.round(price * 100)
  const nowPrice = outcome.toLowerCase() === "yes" ? lastTradePrice : 1 - lastTradePrice
  const nowCents = Math.round(nowPrice * 100)
  const pnl = Number(story.user_pnl) || 0
  const pnlPct = usdc ? (pnl / usdc) * 100 : 0
  const isLoss = pnl < 0

  const userName = story.user_name ?? "Unknown"
  const pseudonym = story.user_pseudonym ?? ""
  const pfp = story.user_pfp ?? ""
  const timestamp = story.timestamp ?? ""

  const betLabel = `Betting $${usdc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} on ${outcome.toUpperCase()}`

  return (
    <Card
      className={cn(
        "rounded-lg border border-slate-200/40 bg-card shadow-sm overflow-hidden transition-all hover:-translate-y-px hover:shadow-md",
        className
      )}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header: avatar, name, pseudonym, timestamp */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border">
              <AvatarImage src={pfp || undefined} alt={userName} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{userName}</span>
                {pseudonym && (
                  <Badge variant="secondary" className="text-xs font-normal px-1.5 py-0">
                    {pseudonym}
                  </Badge>
                )}
              </div>
              {timestamp && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  • {formatRelativeTime(timestamp)}
                </p>
              )}
            </div>
          </div>
          {isLoss && (
            <Badge className="shrink-0 bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 font-semibold text-xs">
              Highlighted Loss
            </Badge>
          )}
        </div>

        {/* Bet summary */}
        <div>
          <p className="font-bold text-base">{betLabel}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Entry {entryCents}¢ → Now {nowCents}¢
          </p>
          <p
            className={cn(
              "text-sm font-medium mt-0.5",
              isLoss ? "text-destructive" : "text-green-600"
            )}
          >
            P&L {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)} USDC {pnl >= 0 ? "+" : ""}
            {pnlPct.toFixed(2)}%
          </p>
        </div>

        {/* Question */}
        {question && (
          <p className="text-base font-semibold text-muted-foreground">{question}</p>
        )}

        {/* Image + YES/NO */}
        <div className="flex gap-4 items-stretch flex-wrap">
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="w-[120px] h-[100px] object-cover rounded-lg shrink-0 bg-muted"
            />
          )}
          <div className="flex-1 flex flex-col gap-2 min-w-0 flex-wrap">
            <div className="flex justify-between items-center px-4 py-2.5 rounded-lg bg-green-500 text-white font-bold text-sm">
              <span>YES</span>
              <span>{yesCents}¢</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 rounded-lg border border-border bg-muted/30 font-bold text-sm">
              <span>NO</span>
              <span>{noCents}¢</span>
            </div>
          </div>
        </div>

        {/* Footer: ACTIVE badge + stats */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          {active && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 font-bold text-[0.7rem]">
              ACTIVE
            </Badge>
          )}
          <p className="text-xs text-muted-foreground">
            24h Vol ${volume24hr.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            {" • "}
            Spread {spread.toFixed(3)}
            {" • "}
            24h Price {price24hr.toFixed(3)}%
          </p>
          {closed && (
            <span className="text-xs text-muted-foreground block">Ended</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
