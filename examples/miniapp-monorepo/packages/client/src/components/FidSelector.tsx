import { Button, Loader } from "@embed-ai/react";
import { FidCard } from "./FidCard";

interface FidSelectorProps {
  title: string;
  isSDKLoaded: boolean;
  onSetFid: (fid: number) => void;
  onResetFid: () => void;
  customFid?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FidSelector({
  title,
  isSDKLoaded,
  onSetFid,
  onResetFid,
  customFid,
  onRefresh,
  isRefreshing,
}: FidSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-muted-foreground">
          {title}
        </h3>
        {onRefresh && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={onRefresh} 
              disabled={isRefreshing} 
              variant="outline" 
              size="sm"
            >
              {isRefreshing && <Loader size="sm" className="mr-2" />}
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* FID Input Card */}
      <div className="grid grid-cols-1 gap-4">
        <FidCard
          isSDKLoaded={isSDKLoaded}
          onSetFid={onSetFid}
          onResetFid={onResetFid}
          customFid={customFid}
        />
      </div>
    </div>
  );
} 
