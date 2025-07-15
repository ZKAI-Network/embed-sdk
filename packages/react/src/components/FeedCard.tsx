import {
  IconCoin,
  IconExternalLink,
  IconHeart,
  IconMessageCircle,
  IconPlayerPlay as IconVideoPlay,
  IconRepeat,
  IconShare,
  IconUser
} from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Card, CardContent } from "./card"
import ImageGallery from "./ImageGallery"
import { LocationCard } from "./LocationCard"
import type { FeedItem } from "./types"
import { UrlEmbed } from "./UrlEmbed"

interface FeedCardProps {
  item: FeedItem
  onReply?: () => void
  onShare?: () => void
  onTip?: () => void
  onViewProfile?: () => void
}

export function FeedCard({ item, onReply, onShare, onTip, onViewProfile }: FeedCardProps) {
  const { author, comments_count, embed_items, likes_count, shares_count, text } = item.metadata

  const [isExpanded, setIsExpanded] = useState(false)

  const { displayText, isLongText } = useMemo(() => {
    const longText = text ? text.length > 300 : false
    const display = longText && !isExpanded ? text.slice(0, 300) : text
    return { displayText: display, isLongText: longText }
  }, [text, isExpanded])

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
        {embed_items &&
          embed_items.length > 0 &&
          (() => {
            // Separate images from other embeds
            const images: Array<string> = []
            const otherEmbeds: Array<string> = []

            embed_items.forEach((embed) => {
              const imageExtensions = /\.(jpeg|jpg|gif|png|webp)$/i
              let isImage = imageExtensions.test(embed) || embed.includes("/ipfs/") // not all ipfs files are images, this is sample app only and these cases should be better supported

              if (!isImage) {
                try {
                  const url = new URL(embed)
                  if (url.hostname === "imagedelivery.net") {
                    isImage = true
                  }
                } catch {
                  // Not a valid URL, ignore
                }
              }

              if (isImage) {
                images.push(embed)
              } else {
                otherEmbeds.push(embed)
              }
            })

            return (
              <div className="space-y-3 pt-2">
                {/* Render image gallery if there are images */}
                {images.length > 0 && <ImageGallery images={images} className="w-full" />}

                {/* Render other embeds */}
                {otherEmbeds.map((embed, index) => {
                  // Handle geographic location URLs
                  if (embed.startsWith("geo:")) {
                    return <LocationCard key={index} geoUrl={embed} />
                  }

                  // Handle Farcaster stream content
                  if (embed.includes("stream.farcaster.xyz")) {
                    return (
                      <Card
                        key={index}
                        className="border hover:bg-gray-50 transition-colors"
                      >
                        <a
                          href={embed}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                                <IconVideoPlay
                                  size={20}
                                  className="text-white"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-primary">
                                  View Media
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Farcaster video content
                                </p>
                              </div>
                              <IconExternalLink
                                size={16}
                                className="text-muted-foreground"
                              />
                            </div>
                          </CardContent>
                        </a>
                      </Card>
                    )
                  }

                  // Handle all other URLs with OG preview
                  return <UrlEmbed key={index} url={embed} />
                })}
              </div>
            )
          })()}

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
