# @embed-ai/react

This package contains the reusable React components for Embed AI.

## Usage

This guide explains how to use the `FeedGrid` and `FeedCard` components to display a feed of items with support for infinite scrolling, refreshing, and user interactions.

### Components

- **`FeedGrid`**: A container component that manages the layout of the feed, including loading states, error messages, and infinite scroll triggers.
- **`FeedCard`**: A component that renders an individual item in the feed, with buttons for actions like sharing, replying, and tipping.

### Example

Here's an example of how to use `FeedGrid` and `FeedCard` to create a dynamic feed:

```tsx
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { FeedGrid, FeedCard, type FeedItem } from "@embed-ai/react";

interface FeedData {
  items: FeedItem[];
  nextPage: () => void;
}

function MyFeed() {
  // State management for your feed data
  const [data, setData] = React.useState<FeedData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch initial data
  React.useEffect(() => {
    // Your data fetching logic here
  }, []);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && data?.nextPage) {
      data.nextPage();
    }
  }, [inView, data]);

  const handleRefresh = () => {
    // Your refresh logic here
  };

  return (
    <FeedGrid
      title="My Feed"
      isLoading={isLoading}
      error={error}
      isFetchingNextPage={false} // Your logic here
      hasNextPage={!!data?.nextPage}
      onRefresh={handleRefresh}
      isRefreshing={false} // Your logic here
      loaderRef={ref}
      isEmpty={!data?.items.length}
    >
      {data?.items.map((item) => (
        <FeedCard
          key={item.item_id}
          item={item}
          onShare={() => console.log("Share clicked")}
          onReply={() => console.log("Reply clicked")}
          onViewProfile={() => console.log("View profile clicked")}
          onTip={() => console.log("Tip clicked")}
        />
      ))}
    </FeedGrid>
  );
}
```

### Key Props

- **`FeedGrid`**
  - `title`: The title of the feed.
  - `isLoading`: Whether the initial data is loading.
  - `error`: An error object to display an error message.
  - `isFetchingNextPage`: Whether the next page of data is being fetched.
  - `hasNextPage`: Whether there is a next page of data to fetch.
  - `onRefresh`: A function to call when the user requests a refresh.
  - `isRefreshing`: Whether a refresh is in progress.
  - `loaderRef`: A ref to attach to the infinite scroll trigger element.
  - `isEmpty`: Whether the feed is empty.

- **`FeedCard`**
  - `item`: The `FeedItem` object to render.
  - `onShare`, `onReply`, `onViewProfile`, `onTip`: Callback functions for user actions.

