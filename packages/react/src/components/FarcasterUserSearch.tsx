import React from "react"
import { Button } from "./button.js"
import { Card, CardContent } from "./card.js"
import { Input } from "./input.js"

interface FarcasterUserSearchProps {
  inputValue: string
  isGetFeedDisabled: boolean
  isInputDisabled: boolean
  isResetDisabled: boolean
  onGetFeed: () => void
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onReset: () => void
}

export function FarcasterUserSearch({
  inputValue,
  isGetFeedDisabled,
  isInputDisabled,
  isResetDisabled,
  onGetFeed,
  onInputChange,
  onKeyDown,
  onReset
}: FarcasterUserSearchProps) {
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
            value={inputValue}
            onChange={onInputChange}
            disabled={isInputDisabled}
            onKeyDown={onKeyDown}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button onClick={onGetFeed} disabled={isGetFeedDisabled}>
            Get Feed
          </Button>
          <Button onClick={onReset} variant="outline" disabled={isResetDisabled}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
