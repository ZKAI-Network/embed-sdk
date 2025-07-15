import { Badge } from "@embed-ai/react";

interface FeedHeaderProps {
  timestamp?: string;
}

export function FeedHeader({ timestamp }: FeedHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      {/* <h1 className="text-2xl font-bold text-blue-600">
        Embed personalized feed
      </h1> */}
      {timestamp && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Updated: {timestamp}
        </Badge>
      )}
    </div>
  );
} 
