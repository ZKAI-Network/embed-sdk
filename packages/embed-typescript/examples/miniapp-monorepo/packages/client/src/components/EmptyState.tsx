import { Card, Center, Stack, Text } from "@mantine/core";

export function EmptyState() {
  return (
    <Card withBorder p="xl" radius="md">
      <Center>
        <Stack align="center" gap="sm">
          <Text c="dimmed" fw={500}>
            No posts available
          </Text>
          <Text c="dimmed" size="sm">
            Check back later for new content
          </Text>
        </Stack>
      </Center>
    </Card>
  );
} 
