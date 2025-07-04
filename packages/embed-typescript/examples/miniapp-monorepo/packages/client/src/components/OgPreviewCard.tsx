import { Card, CardContent } from "./ui/card";

interface OgPreviewCardProps {
  data: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: { url: string }[];
    ogUrl?: string;
    requestUrl?: string;
    [key: string]: any;
  };
}

export function OgPreviewCard({ data }: OgPreviewCardProps) {
  const { ogTitle, ogDescription, ogImage, ogUrl, requestUrl } = data;
  const imageUrl = ogImage?.[0]?.url;
  const displayUrl = ogUrl || requestUrl;

  return (
    <Card className="border rounded-md hover:bg-gray-50 transition-colors">
      <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="block">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {imageUrl && (
              <img 
                src={imageUrl} 
                className="w-20 h-20 rounded-sm object-cover flex-shrink-0" 
                alt={ogTitle || "Preview image"} 
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-1">
                {ogTitle || "No title available"}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {ogDescription || "No description available"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {displayUrl}
              </p>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
} 
