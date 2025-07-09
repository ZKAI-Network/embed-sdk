import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { useFeedData } from "./hooks";
import { DEFAULT_FEED_ID } from "../../shared/constants/feedIds";
import type { FeedId } from "../../shared/constants/feedIds";

function App() {
  const [page, setPage] = useState("home");
  const [selectedFeed, setSelectedFeed] = useState<FeedId>(DEFAULT_FEED_ID);
  const homeFeed = useFeedData({ feedId: selectedFeed });
  const exploreFeed = useFeedData({ fetchDefault: false });

  return (
    <Navigation page={page} setPage={setPage}>
      {page === "home" && (
        <HomePage
          {...homeFeed}
          selectedFeed={selectedFeed}
          setSelectedFeed={setSelectedFeed}
        />
      )}
      {page === "explore" && <ExplorePage {...exploreFeed} />}
    </Navigation>
  );
}

export default App; 
