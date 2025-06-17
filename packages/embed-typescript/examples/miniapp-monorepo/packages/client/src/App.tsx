import { Alert, Stack, Container } from "@mantine/core";
import { FeedHeader, FeedGrid } from "./components";
import { useFeedData } from "./hooks";

function App() {
  const {
    data,
    isLoading,
    error,
    fidToUse,
    timestamp,
    isRunningOnFrame,
    isSDKLoaded,
  } = useFeedData();

  return (
    <Container size="xl" px="md" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <FeedHeader timestamp={timestamp} />
        
        {/* Demo Mode Alert */}
        {!isRunningOnFrame && (
          <Alert 
            title="Demo Mode" 
            color="blue" 
            variant="light"
          >
            This is a demo feed. Run in a Farcaster frame for personalized content.
          </Alert>
        )}

        {/* Feed Content */}
        {isSDKLoaded && (
          <FeedGrid
            data={data}
            isLoading={isLoading}
            error={error}
            fidToUse={fidToUse}
          />
        )}
      </Stack>
    </Container>
  );
}

export default App; 
