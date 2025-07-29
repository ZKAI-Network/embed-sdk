"use client";

import { FeedCard, type FeedItem } from "@embed-ai/react/feed";
import { isMiniApp } from "../utils/miniapp";
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
 */
export function CustomFeedCard({ item, ...props }: CustomFeedCardProps) {
  // Check if this item has any Zora embeds
  const hasMiniAppEmbeds = item.metadata.embed_items?.some(embed => isMiniApp(embed));
  
  // If no Mini App embeds, use original FeedCard
  if (!hasMiniAppEmbeds) {
    return (
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCard item={item} {...props} />
      </div>
    );
  }
  
  // Process the item to handle Mini App embeds
  const processedItem: FeedItem = {
    ...item,
    metadata: {
      ...item.metadata,
      // We'll render Mini App embeds separately, so filter them out from embed_items
      embed_items: item.metadata.embed_items?.filter(embed => !isMiniApp(embed)),
    }
  };
  
  // Extract Mini App embeds for separate rendering
  const miniAppEmbeds = item.metadata.embed_items?.filter(embed => isMiniApp(embed)) || [];
  
  return (
    <div className="w-full max-w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Custom FeedCard with integrated Mini App components */}
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCardWithMiniApp item={processedItem} miniAppEmbeds={miniAppEmbeds} {...props} />
      </div>
    </div>
  );
}

interface FeedCardWithMiniAppProps {
  item: FeedItem;
  miniAppEmbeds: string[];
  onShare?: () => void;
  onReply?: () => void;
  onViewProfile?: () => void;
  onTip?: () => void;
}

/**
 * Custom component that renders FeedCard with Mini App components integrated
 * This creates a seamless appearance by styling the Mini App component to look like part of the FeedCard
 */
function FeedCardWithMiniApp({ item, miniAppEmbeds, ...props }: FeedCardWithMiniAppProps) {
  return (
    <div className="feed-card-with-zora-container">
      {/* Render the original FeedCard */}
      <div className="feed-card-wrapper">
        <FeedCard item={item} {...props} />
      </div>
      
      {/* Render Mini App components styled to appear as part of the FeedCard */}
      {miniAppEmbeds.length > 0 && (
        <div className="miniapp-extension">
          {miniAppEmbeds.map((embed, index) => (
            <div key={`miniapp-${index}`} className="w-full max-w-full">
              <MiniAppEmbedRenderer embed={embed} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
