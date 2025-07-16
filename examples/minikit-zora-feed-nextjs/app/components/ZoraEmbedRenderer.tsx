"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { Buy } from "@coinbase/onchainkit/buy";
import { parseZoraUrl, isZoraTokenUrl, isSupportedChain, getChainDisplayName } from "../utils/zora";
import { useTokenFromContract } from "../hooks/useTokenFromContract";

interface ZoraEmbedRendererProps {
  embed: string;
  fallback?: ReactNode;
}

/**
 * Component that renders Zora token embeds with Buy components
 * Falls back to original link preview for non-Zora URLs
 */
export function ZoraEmbedRenderer({ embed, fallback }: ZoraEmbedRendererProps) {
  // Check if the embed is a Zora URL
  if (!isZoraTokenUrl(embed)) {
    return fallback || <DefaultEmbedFallback url={embed} />;
  }

  const zoraInfo = parseZoraUrl(embed);
  
  if (!zoraInfo) {
    return fallback || <DefaultEmbedFallback url={embed} />;
  }

  return <ZoraTokenEmbed zoraInfo={zoraInfo} originalUrl={embed} />;
}

interface ZoraTokenEmbedProps {
  zoraInfo: NonNullable<ReturnType<typeof parseZoraUrl>>;
  originalUrl: string;
}

function ZoraTokenEmbed({ zoraInfo, originalUrl }: ZoraTokenEmbedProps) {
  const { token, isLoading, error } = useTokenFromContract(
    zoraInfo.contractAddress,
    zoraInfo.chainId
  );

  // Check if chain is supported
  if (!isSupportedChain(zoraInfo.chainId)) {
    return (
      <UnsupportedChainMessage 
        chainName={getChainDisplayName(zoraInfo.chainId)}
        originalUrl={originalUrl}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingTokenEmbed />;
  }

  // Error state
  if (error || !token) {
    return <ErrorTokenEmbed error={error} originalUrl={originalUrl} />;
  }

  // Success state - render Buy component integrated into the feed card
  return (
    <div className="zora-embed-renderer space-y-3 max-w-full overflow-hidden">
      <div className="flex items-center space-x-3 min-w-0">
        {token.image && (
          <Image 
            src={token.image} 
            alt={token.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-[var(--app-foreground)] truncate text-sm">
            {token.name}
          </h4>
          <p className="text-xs text-[var(--app-foreground-muted)] truncate">
            {token.symbol} • {getChainDisplayName(zoraInfo.chainId)}
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-full overflow-hidden">
        <div className="max-w-full [&>*]:max-w-full [&>*]:overflow-hidden">
          <Buy toToken={token} />
        </div>
      </div>
    </div>
  );
}

function LoadingTokenEmbed() {
  return (
    <div className="zora-embed-renderer space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-[var(--app-gray)] animate-pulse" />
        <div className="space-y-2">
          <div className="w-20 h-3 bg-[var(--app-gray)] rounded animate-pulse" />
          <div className="w-12 h-2 bg-[var(--app-gray)] rounded animate-pulse" />
        </div>
      </div>
      <div className="w-full h-10 bg-[var(--app-gray)] rounded animate-pulse" />
    </div>
  );
}

interface ErrorTokenEmbedProps {
  error: string | null;
  originalUrl: string;
}

function ErrorTokenEmbed({ error, originalUrl }: ErrorTokenEmbedProps) {
  return (
    <div className="zora-embed-renderer">
      <div className="space-y-2">
        <p className="text-xs text-red-500">
          Failed to load token: {error || 'Unknown error'}
        </p>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--app-accent)] hover:underline text-xs"
        >
          View on Zora →
        </a>
      </div>
    </div>
  );
}

interface UnsupportedChainMessageProps {
  chainName: string;
  originalUrl: string;
}

function UnsupportedChainMessage({ chainName, originalUrl }: UnsupportedChainMessageProps) {
  return (
    <div className="zora-embed-renderer">
      <div className="space-y-2">
        <p className="text-xs text-[var(--app-foreground-muted)]">
          Token trading not supported on {chainName}
        </p>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--app-accent)] hover:underline text-xs"
        >
          View on Zora →
        </a>
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