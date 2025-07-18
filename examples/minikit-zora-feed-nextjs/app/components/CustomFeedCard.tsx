"use client";

import { FeedCard, type FeedItem } from "@embed-ai/react/feed";
import { ZoraEmbedRenderer } from "./ZoraEmbedRenderer";
import { isZoraTokenUrl } from "../utils/zora";

interface CustomFeedCardProps {
  item: FeedItem;
  onShare?: () => void;
  onReply?: () => void;
  onViewProfile?: () => void;
  onTip?: () => void;
}

/**
 * Custom FeedCard wrapper that processes Zora embeds
 * This component integrates Zora buy components directly into the FeedCard structure
 */
export function CustomFeedCard({ item, ...props }: CustomFeedCardProps) {
  // Check if this item has any Zora embeds
  const hasZoraEmbeds = item.metadata.embed_items?.some(embed => isZoraTokenUrl(embed));
  
  // If no Zora embeds, use original FeedCard
  if (!hasZoraEmbeds) {
    return (
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCard item={item} {...props} />
      </div>
    );
  }
  
  // Process the item to handle Zora embeds
  const processedItem: FeedItem = {
    ...item,
    metadata: {
      ...item.metadata,
      // We'll render Zora embeds separately, so filter them out from embed_items
      embed_items: item.metadata.embed_items?.filter(embed => !isZoraTokenUrl(embed)),
    }
  };
  
  // Extract Zora embeds for separate rendering
  const zoraEmbeds = item.metadata.embed_items?.filter(embed => isZoraTokenUrl(embed)) || [];
  
  return (
    <div className="w-full max-w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Custom FeedCard with integrated Zora components */}
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCardWithZoraBuy item={processedItem} zoraEmbeds={zoraEmbeds} {...props} />
      </div>
    </div>
  );
}

interface FeedCardWithZoraBuyProps {
  item: FeedItem;
  zoraEmbeds: string[];
  onShare?: () => void;
  onReply?: () => void;
  onViewProfile?: () => void;
  onTip?: () => void;
}

/**
 * Custom component that renders FeedCard with Zora Buy components integrated
 * This creates a seamless appearance by styling the Buy component to look like part of the FeedCard
 */
function FeedCardWithZoraBuy({ item, zoraEmbeds, ...props }: FeedCardWithZoraBuyProps) {
  return (
    <div className="feed-card-with-zora-container">
      {/* Render the original FeedCard */}
      <div className="feed-card-wrapper">
        <FeedCard item={item} {...props} />
      </div>
      
      {/* Render Zora Buy components styled to appear as part of the FeedCard */}
      {zoraEmbeds.length > 0 && (
        <div className="zora-buy-extension">
          {zoraEmbeds.map((embed, index) => (
            <div key={`zora-${index}`} className="w-full max-w-full">
              <ZoraEmbedRenderer embed={embed} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}