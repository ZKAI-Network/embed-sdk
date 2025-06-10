import { useFrame } from "./FrameProvider";
import { trpc } from "./trpc";

function App() {
  const { data, isLoading } = trpc.greeting.useQuery({ name: "Monorepo" });
  const {
    isSDKLoaded,
    isRunningOnFrame,
    isRunningOnMobile,
    context,
    lastEvent,
  } = useFrame();

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
        </>
      )}
    </div>
  );
}

export default App;
