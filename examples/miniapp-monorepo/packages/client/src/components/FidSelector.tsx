import { Button, FarcasterUserSearch, Loader } from "@embed-ai/react";
import { useState } from "react";

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
  const [fidInput, setFidInput] = useState(customFid?.toString() || "");

  const handleSetFid = () => {
    const fid = parseInt(fidInput, 10);
    if (!isNaN(fid) && fid > 0) {
      onSetFid(fid);
    }
  };

  const handleResetFid = () => {
    onResetFid();
    setFidInput("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = event.currentTarget.value.replace(/\D/g, "");
    setFidInput(sanitized);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSetFid();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-muted-foreground">{title}</h3>
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
        <FarcasterUserSearch
          inputValue={fidInput}
          onInputChange={handleInputChange}
          onGetFeed={handleSetFid}
          onReset={handleResetFid}
          onKeyDown={handleKeyDown}
          isGetFeedDisabled={!isSDKLoaded || !fidInput}
          isResetDisabled={!isSDKLoaded || customFid === undefined}
          isInputDisabled={!isSDKLoaded}
        />
      </div>
    </div>
  );
} 
