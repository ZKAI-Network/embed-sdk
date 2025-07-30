"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/frame-sdk"
import { isMiniApp, extractDomain, getMiniAppMetadata } from "../utils/miniapp";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";

interface MiniAppMetadata {
  version: string;
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: 'launch_frame' | 'view_token';
      url?: string;
      name?: string;
      splashImageUrl?: string;
      splashBackgroundColor?: string;
    };
  };
}

interface MiniAppEmbedRendererProps {
  embed: string;
}

/**
 * Component that renders Mini App embeds
 * Falls back to original link preview for non-Mini App URLs
 */
export function MiniAppEmbedRenderer({ embed }: MiniAppEmbedRendererProps) {
  const [isMiniAppUrl, setIsMiniAppUrl] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsMiniApp = async () => {
      const result = await isMiniApp(embed);
      setIsMiniAppUrl(result);
    };

    checkIsMiniApp();
  }, [embed]);

  // Show loading state while checking
  if (isMiniAppUrl === null) {
    return (
      <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden p-4 animate-pulse">
        <div className="h-4 bg-[var(--app-gray)] rounded mb-2"></div>
        <div className="h-3 bg-[var(--app-gray)] rounded w-2/3"></div>
      </div>
    );
  }

  // Check if the embed is a Mini App URL
  if (!isMiniAppUrl) {
    return <></>;
  }

  return <MiniAppEmbed embed={embed} />;
}

interface MiniAppEmbedProps {
  embed: string;
}

function MiniAppEmbed({ embed }: MiniAppEmbedProps) {
  const { context } = useMiniKit();
  const domain = extractDomain(embed);
  const isInMiniApp = Boolean(context?.client);
  const [metadata, setMetadata] = useState<MiniAppMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [metadataError, setMetadataError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoadingMetadata(true);
        setMetadataError(false);
        const meta = await getMiniAppMetadata(embed);
        setMetadata(meta);
      } catch (error) {
        console.warn('Failed to fetch Mini App metadata:', error);
        setMetadataError(true);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [embed]);

  const handleOpenApp = () => {
    const targetUrl = metadata?.button.action.url || embed;
    
    if (isInMiniApp) {
      // Use MiniKit SDK to open the mini app
      sdk.actions.openMiniApp({ url: targetUrl });
    } else {
      // Fallback to Farcaster deeplink
      const deeplink = `https://farcaster.xyz/~/mini-apps/launch?domain=${extractDomain(targetUrl)}`;
      window.open(deeplink, '_blank', 'noopener,noreferrer');
    }
  };

  // Loading state
  if (isLoadingMetadata) {
    return (
      <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden animate-pulse">
        <div className="aspect-[3/2] bg-[var(--app-gray)] rounded-t-xl"></div>
        <div className="p-4">
          <div className="h-4 bg-[var(--app-gray)] rounded mb-2"></div>
          <div className="h-3 bg-[var(--app-gray)] rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Error state or fallback
  if (metadataError || !metadata) {
    return (
      <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden p-4 space-y-3 max-w-full">
        <div className="flex items-start justify-between space-x-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
              Mini App
            </h3>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-3 break-all">
              {domain}
            </p>
          </div>
        </div>
        <Button
          onClick={handleOpenApp}
          variant="primary"
          size="md"
          className="w-full"
          icon={<Icon name="external-link" size="sm" />}
        >
          Open App
        </Button>
      </div>
    );
  }

  // Render with metadata
  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden max-w-full">
      {/* Mini App Image - 3:2 aspect ratio as per spec */}
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={metadata.imageUrl}
          alt={metadata.button.action.name || domain}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a solid color background if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.backgroundColor = metadata.button.action.splashBackgroundColor || 'var(--app-gray)';
          }}
        />
      </div>
      
      {/* Content and Button */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between space-x-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-1">
              {metadata.button.action.name || domain}
            </h3>
            <p className="text-sm text-[var(--app-foreground-muted)] break-all">
              {domain}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleOpenApp}
          variant="primary"
          size="md"
          className="w-full"
          icon={<Icon name="external-link" size="sm" />}
        >
          {metadata.button.title}
        </Button>
      </div>
    </div>
  );
}
