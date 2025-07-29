"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { isMiniApp } from "../utils/miniapp";

interface MiniAppEmbedRendererProps {
  embed: string;
  fallback?: ReactNode;
}

/**
 * Component that renders Mini App embeds
 * Falls back to original link preview for non-Mini App URLs
 */
export function MiniAppEmbedRenderer({ embed, fallback }: MiniAppEmbedRendererProps) {
  // Check if the embed is a Mini App URL
  if (!isMiniApp(embed)) {
    return fallback || <DefaultEmbedFallback url={embed} />;
  }

  return <MiniAppEmbed embed={embed} />;
}

interface MiniAppEmbedProps {
  embed: string;
}

function MiniAppEmbed({ embed }: MiniAppEmbedProps) {
  // Success state - render Mini App component integrated into the feed card
  return (
    <div className="zora-embed-renderer space-y-3 max-w-full overflow-hidden">
      <div className="flex items-start space-x-3 min-w-0">
        <div
          className="w-full h-full flex-shrink-0 mt-0.5"
        >
          MiniApp: {embed}
        </div>
      </div>   
    </div>
  );
}

interface DefaultEmbedFallbackProps {
  url: string;
}

function DefaultEmbedFallback({ url }: DefaultEmbedFallbackProps) {
  return (
    <div className="zora-embed-renderer">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--app-accent)] hover:underline text-xs break-all"
      >
        {url}
      </a>
    </div>
  );
}
