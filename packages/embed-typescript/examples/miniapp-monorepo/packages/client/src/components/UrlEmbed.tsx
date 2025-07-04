import { trpc } from "../trpc";
import { OgPreviewCard } from "./OgPreviewCard";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface UrlEmbedProps {
  url: string;
}

export function UrlEmbed({ url }: UrlEmbedProps) {
  const { data, isLoading, error } = trpc.getOgData.useQuery({ url });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !data || !data.success) {
    // Fallback to a simple link if OG data fails
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        {url}
      </a>
    );
  }

  return <OgPreviewCard data={data} />;
} 
