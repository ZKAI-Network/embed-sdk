import { FarcasterUserSearch } from "@embed-ai/react";
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
  );
} 
