"use client";

import { FeedCard, type FeedItem } from "@embed-ai/react/feed";
import { MiniAppEmbedRenderer } from "./MiniAppEmbedRenderer";

interface CustomFeedCardProps {
  item: FeedItem;
  onShare?: () => void;
  onReply?: () => void;
  onViewProfile?: () => void;
  onTip?: () => void;
}

/**
 * Custom FeedCard wrapper that processes Mini App embeds
 * This component integrates Mini App components directly into the FeedCard structure
 * 
 * NOTE: We can't use synchronous isMiniApp() filtering here since it's async.
 * Instead, we let MiniAppEmbedRenderer handle the detection and just render all embeds.
 */
export function CustomFeedCard({ item, ...props }: CustomFeedCardProps) {
  // Always render with potential Mini App embeds - let MiniAppEmbedRenderer handle detection
  return (
    <div className="w-full max-w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Render the original FeedCard first */}
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCard item={item} {...props} />
      </div>
      
      {/* Render potential Mini App embeds - MiniAppEmbedRenderer will handle detection */}
      {item.metadata.embed_items && item.metadata.embed_items.length > 0 && (
        <div className="miniapp-embeds-container mt-3">
          {item.metadata.embed_items
            .filter(embed => typeof embed === 'string' && (embed.startsWith('http://') || embed.startsWith('https://')))
            .map((embed, index) => (
              <div key={`embed-${index}`} className="w-full max-w-full mb-2">
                <MiniAppEmbedRenderer embed={embed} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

