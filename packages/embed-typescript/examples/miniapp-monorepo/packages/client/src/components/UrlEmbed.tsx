import { trpc } from "../trpc";
import { OgPreviewCard } from "./OgPreviewCard";
import { Text } from "@mantine/core";
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
      <Text size="sm" component="a" href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </Text>
    );
  }

  return <OgPreviewCard data={data} />;
} 
