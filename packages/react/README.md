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

## Customization

### Styling

The components are built with Tailwind CSS and designed to be easily customizable. Each component supports style overrides and follows a customization-first approach.

#### Overriding Styles

You can customize the appearance by:

1. **CSS Variables**: The components use CSS variables for theming
2. **Tailwind Classes**: Override default classes with your own
3. **Custom CSS**: Add your own styles via className props

#### Examples

```tsx
// Custom styling for FeedGrid container
<FeedGrid
  title="My Custom Feed"
  className="bg-gray-100 p-8 rounded-xl"
  // ... other props
>
  {data?.items.map((item) => (
    <FeedCard
      key={item.item_id}
      item={item}
      className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all"
      // ... other props
    />
  ))}
</FeedGrid>
```

```css
/* Custom CSS variables for theming */
:root {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --text-primary: #111827;
  --text-muted: #6b7280;
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
}

/* Dark theme example */
.dark {
  --card-bg: #1f2937;
  --card-border: #374151;
  --text-primary: #f9fafb;
  --text-muted: #9ca3af;
  --primary-color: #60a5fa;
  --primary-hover: #3b82f6;
}
```

#### Component Structure

The components are designed to fit into any design system:

- **FeedGrid**: Provides layout structure without forcing specific styling
- **FeedCard**: Uses semantic HTML with accessible markup
- **Responsive**: Works with any responsive design system
- **Flexible**: All styling can be overridden without breaking functionality

For advanced customization, you can wrap the components or create your own variants using the same data structures.

