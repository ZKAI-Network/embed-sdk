import { Card, Stack, Group, Skeleton } from "@mantine/core";

export function LoadingSkeleton() {
  return (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      <Stack gap="md">
        <Group gap="sm">
          <Skeleton height={50} circle />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={16} width="40%" />
            <Skeleton height={12} width="30%" />
          </Stack>
        </Group>
        <Stack gap="xs">
          <Skeleton height={14} />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
        </Stack>
        <Group justify="space-between" mt="md">
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={30} />
        </Group>
      </Stack>
    </Card>
  );
} 
