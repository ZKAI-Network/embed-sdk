import { Card, Center, Stack, Text } from "@mantine/core";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Card withBorder p="xl" radius="md" bg="red.0">
      <Center>
        <Stack align="center" gap="sm">
          <Text c="red" fw={500}>
            Error loading feed
          </Text>
          <Text c="red" size="sm">
            {message}
          </Text>
        </Stack>
      </Center>
    </Card>
  );
} 
