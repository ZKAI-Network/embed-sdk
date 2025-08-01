"use client";

import { FeedCard, type FeedItem } from "@embed-ai/react/feed";
import { MiniAppEmbedRenderer } from "./MiniAppEmbedRenderer";
import { useState, useEffect } from "react";
import { batchCheckMiniApps } from "../utils/miniapp";

interface CustomFeedCardProps {
  item: FeedItem;
  onShare?: () => void;
  onReply?: () => void;
  onViewProfile?: () => void;
  onTip?: () => void;
}

/**
 * Custom FeedCard wrapper that processes Mini App embeds
 * This component filters out mini apps from the main FeedCard to avoid duplication
 */
export function CustomFeedCard({ item, ...props }: CustomFeedCardProps) {
  const [miniAppUrls, setMiniAppUrls] = useState<Set<string>>(new Set());

  const embedUrls = item.metadata.embed_items
    ?.filter(embed => typeof embed === 'string' && (embed.startsWith('http://') || embed.startsWith('https://')))
    || [];

  useEffect(() => {
    if (embedUrls.length === 0) return;
    
    batchCheckMiniApps(embedUrls as string[])
      .then(results => {
        const miniApps = new Set<string>();
        results.forEach((isMiniApp, url) => {
          if (isMiniApp) miniApps.add(url);
        });
        setMiniAppUrls(miniApps);
      });
  }, [embedUrls.join(',')]);

  // Create modified item with mini app URLs filtered out of embed_items
  const modifiedItem = {
    ...item,
    metadata: {
      ...item.metadata,
      embed_items: item.metadata.embed_items?.filter(embed => 
        typeof embed !== 'string' || !miniAppUrls.has(embed)
      )
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Render FeedCard with mini app URLs filtered out */}
      <div 
        className="w-full max-w-full overflow-hidden [&>*]:max-w-full [&>*]:overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full [&_video]:h-auto [&_iframe]:max-w-full [&_iframe]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:break-all [&_p]:break-words [&>*]:box-border"
        style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <FeedCard item={modifiedItem} {...props} />
      </div>
      
      {/* Render Mini App embeds separately */}
      {embedUrls.length > 0 && (
        <div className="miniapp-embeds-container mt-3">
          {embedUrls.map((embed, index) => (
            <div key={`embed-${index}`} className="w-full max-w-full mb-2">
              <MiniAppEmbedRenderer embed={embed} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

