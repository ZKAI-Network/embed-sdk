import { useFrame } from "./FrameProvider";
import { trpc } from "./trpc";
import { useEffect, useState } from "react";

function App() {
  const { data, isLoading } = trpc.greeting.useQuery({ name: "Monorepo" });
  const {
    isSDKLoaded,
    isRunningOnFrame,
    isRunningOnMobile,
    context,
    lastEvent,
  } = useFrame();

  const fidToUse = isRunningOnMobile ? (context as any)?.client?.requester?.fid : 3;

  const {
    data: forYouData,
    isLoading: forYouLoading,
    error: forYouError,
  } = trpc.forYouFeed.useQuery({ fid: fidToUse! }, { enabled: !!fidToUse });

  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    if (forYouData) {
      setTimestamp(new Date().toLocaleTimeString());
    }
  }, [forYouData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <p>{data}</p>
      <hr />
      <h2>Farcaster Frame details</h2>
      <p>
        SDK Loaded: <span>{isSDKLoaded ? "✅" : "❌"}</span>
      </p>
      <p>
        Running on frame: <span>{isRunningOnFrame ? "✅" : "❌"}</span>
      </p>
      <p>
        Running on mobile: <span>{isRunningOnMobile ? "✅" : "❌"}</span>
      </p>
      {isRunningOnFrame && (
        <>
          <h3>Context</h3>
          <pre>{JSON.stringify(context, null, 2)}</pre>
          <h3>Last event</h3>
          <pre>{lastEvent}</pre>
          <h3>Custom feed: {timestamp && `(at: ${timestamp})`}</h3>
          {fidToUse && (
            <>
              <hr />
              <h2>For You Feed for FID: {fidToUse}</h2>
              {forYouLoading && <p>Loading For You feed...</p>}
              {forYouError && (
                <p>Error loading feed: {forYouError.message}</p>
              )}
              {forYouData && <pre>{JSON.stringify(forYouData, null, 2)}</pre>}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
