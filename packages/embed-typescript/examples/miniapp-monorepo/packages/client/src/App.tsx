import { trpc } from "./trpc";

function App() {
  const { data, isLoading } = trpc.greeting.useQuery({ name: "Monorepo" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

export default App;
