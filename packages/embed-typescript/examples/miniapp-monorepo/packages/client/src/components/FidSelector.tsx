import { SimpleGrid, Stack, Group, Title, Loader, Button } from "@mantine/core";
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
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3} c="dimmed">
          {title}
        </Title>
        {onRefresh && (
          <Group>
            <Button onClick={onRefresh} loading={isRefreshing} variant="light" size="xs">
              Refresh
            </Button>
          </Group>
        )}
      </Group>

      {/* FID Input Card */}
      <SimpleGrid
        cols={{ base: 1, sm: 1, md: 1, lg: 1 }}
        spacing="md"
      >
        <FidCard
          isSDKLoaded={isSDKLoaded}
          onSetFid={onSetFid}
          onResetFid={onResetFid}
          customFid={customFid}
        />
      </SimpleGrid>
    </Stack>
  );
} 
