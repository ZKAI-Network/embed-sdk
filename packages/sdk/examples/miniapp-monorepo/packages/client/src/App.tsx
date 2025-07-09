import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { useFeedData } from "./hooks";

function App() {
  const [page, setPage] = useState("home");
  const homeFeed = useFeedData();
  const exploreFeed = useFeedData({ fetchDefault: false });

  return (
    <Navigation page={page} setPage={setPage}>
      {page === "home" && <HomePage {...homeFeed} />}
      {page === "explore" && <ExplorePage {...exploreFeed} />}
    </Navigation>
  );
}

export default App; 
