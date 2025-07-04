import { trpc } from "../trpc";
import { OgPreviewCard } from "./OgPreviewCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Card, CardContent } from "./ui/card";
import { IconLink, IconExternalLink } from "@tabler/icons-react";

interface UrlEmbedProps {
  url: string;
}

export function UrlEmbed({ url }: UrlEmbedProps) {
  const { data, isLoading, error } = trpc.getOgData.useQuery({ url });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !data || !data.success) {
    // Fallback to a nice card if OG data fails
    return (
      <Card className="border hover:bg-gray-50 transition-colors">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  <IconLink size={20} className="text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-primary hover:underline truncate">
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </p>
                  <IconExternalLink size={12} className="text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {url}
                </p>
              </div>
            </div>
          </CardContent>
        </a>
      </Card>
    );
  }

  return <OgPreviewCard data={data} />;
} 
