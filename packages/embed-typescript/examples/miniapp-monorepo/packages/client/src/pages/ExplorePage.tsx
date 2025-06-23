import { Stack, Container, Button, TextInput, Paper, Text, Group, Flex } from "@mantine/core";
import { FeedGrid } from "../components";
import { useState, useEffect } from "react";
import type { UseFeedDataReturn } from "../hooks/useFeedData";

export function ExplorePage(props: UseFeedDataReturn) {
  const {
    data,
    isLoading,
    error,
    fidToUse,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefreshing: isDataRefreshing,
    setFid,
    customFid,
    isSDKLoaded,
  } = props;

  const [fidInput, setFidInput] = useState("");

  useEffect(() => {
    if (customFid) {
      setFidInput(customFid.toString());
    } else {
      setFidInput("");
    }
  }, [customFid]);

  const handleSetFid = () => {
    const fid = parseInt(fidInput, 10);
    if (!isNaN(fid) && fid > 0) {
      setFid(fid);
    }
  };

  const handleResetFid = () => {
    setFid(undefined);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const showFeed = isLoading || (data && data.length > 0);

  const exploreInput = (
    <Paper withBorder p="md" radius="md" w={400}>
      <Stack gap="md">
        <Stack gap={0}>
          <Text fw={500}>Explore a feed</Text>
          <Text size="sm" c="dimmed">
            Enter a Farcaster ID (FID) to view their feed.
          </Text>
        </Stack>
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
        />
        <Group grow>
          <Button onClick={handleSetFid} disabled={!isSDKLoaded || !fidInput}>
            Get Feed
          </Button>
          <Button onClick={handleResetFid} variant="light" disabled={!isSDKLoaded || customFid === undefined}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Paper>
  );

  if (!showFeed) {
    return (
      <Flex h="100%" align="center" justify="center">
        {exploreInput}
      </Flex>
    );
  }

  return (
    <Container size="xl" px="md" py="xl">
      <Stack gap="xl">
        {exploreInput}
        <FeedGrid
          title={fidToUse ? `Feed for FID: ${fidToUse}` : "Feed Explorer"}
          data={data}
          isLoading={isLoading}
          error={error}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onRefresh={handleRefresh}
          isRefreshing={isDataRefreshing}
        />
      </Stack>
    </Container>
  );
} 
