import { Card, Stack, Group, Text, TextInput, Button } from "@mantine/core";
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
    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "100%" }}>
      <Stack gap="md" style={{ height: "100%" }}>
        {/* Header */}
        <Stack gap={0}>
          <Text fw={500}>View Someone's Feed</Text>
          <Text size="sm" c="dimmed">
            Enter a Farcaster ID (FID) to view their feed.
          </Text>
        </Stack>

        {/* Input */}
        <TextInput
          label="Farcaster User ID (FID)"
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
          style={{ flex: 1 }}
        />

        {/* Action Buttons */}
        <Group grow mt="auto">
          <Button onClick={handleSetFid} disabled={!isSDKLoaded || !fidInput}>
            Get Feed
          </Button>
          <Button onClick={handleResetFid} variant="light" disabled={!isSDKLoaded || customFid === undefined}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Card>
  );
} 
