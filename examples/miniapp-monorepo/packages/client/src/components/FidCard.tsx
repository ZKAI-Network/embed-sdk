import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface FidCardProps {
  isSDKLoaded: boolean;
  onSetFid: (fid: number) => void;
  onResetFid: () => void;
  customFid?: number;
}

export function FidCard({ isSDKLoaded, onSetFid, onResetFid, customFid }: FidCardProps) {
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

  return (
    <Card className="border rounded-lg shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-medium">View Someone's Feed</h3>
          <p className="text-sm text-muted-foreground">
            Enter a Farcaster ID (FID) to view their feed.
          </p>
        </div>

        {/* Input */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium" htmlFor="fid-input">
            Farcaster User ID (FID)
          </label>
          <Input
            id="fid-input"
            placeholder="e.g. 3"
            value={fidInput}
            onChange={(event) => {
              const sanitized = event.currentTarget.value.replace(/\D/g, "");
              setFidInput(sanitized);
            }}
            disabled={!isSDKLoaded}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSetFid();
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button onClick={handleSetFid} disabled={!isSDKLoaded || !fidInput}>
            Get Feed
          </Button>
          <Button 
            onClick={handleResetFid} 
            variant="outline" 
            disabled={!isSDKLoaded || customFid === undefined}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
