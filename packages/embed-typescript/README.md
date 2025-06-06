# Embed TypeScript

The core TypeScript package for embed APIs, featuring a pre-configured HTTP client for mbd.xyz API.

## Features

- 🚀 Pre-configured HTTP client for mbd.xyz API
- 🔐 Automatic authentication with Bearer tokens
- 📝 All required headers set automatically
- 🎯 **Dual API**: Choose between Effect-based or Promise-based clients
- ⚙️ Configurable base URL, referer, and title
- 🔧 Same reliable Effect implementation under the hood

## Example

See `examples/embed-typescript-sdk.ts` for a comprehensive showcase of:

- ForYou Feed, Search, and Recommendations
- Both Promise and Effect APIs
- Sequential and concurrent operations
- Actual JSON response output

Run it with

```bash
bun run examples/embed-typescript-sdk.ts
```

## Quick Start

Choose your preferred API style:

### Option 1: Promise-based API (Familiar & Easy)

```typescript
import { createMbdClient } from "embed-typescript"

// Simple usage with async/await
const client = createMbdClient("your-token-here")

// Get personalized ForYou feed
const feed = await client.api.ForYouReranked({
  user_id: "3621",
  items_list: []
})

// Search for content
const results = await client.api.Search({
  query: "crypto blockchain",
  top_k: 5
})

console.log(feed, results)
```

### Option 2: Effect-based API (Powerful & Composable)

```typescript
import { Effect } from "effect"
import { EmbedApi, getClient } from "embed-typescript"

// Simple usage with Effect
const program = Effect.gen(function* () {
  // Get personalized ForYou feed
  const feed = yield* EmbedApi.ForYouReranked({
    user_id: "3621",
    items_list: []
  })

  // Search for content
  const results = yield* EmbedApi.Search({
    query: "crypto blockchain",
    top_k: 5
  })

  console.log(feed, results)
})

// Run (assumes token in env variable: API_KEY_EMBED
Effect.runPromise(program.pipe(Effect.provide(getClient())))
```

### Advanced Configuration

#### Promise-based Configuration

```typescript
import { createMbdClient } from "embed-typescript"

// Uses API_KEY_EMBED environment variable
const client = createMbdClient()

// Or with explicit token
const clientWithToken = createMbdClient("your-token-here")

// Use with async/await for concurrent requests
const [feed, trending, popular] = await Promise.all([
  client.api.ForYouReranked({ user_id: "3621", items_list: [] }),
  client.api.Trending({ top_k: 10 }),
  client.api.Popular({ top_k: 10 })
])
```

#### Effect-based Configuration

```typescript
import { Effect } from "effect"
import { EmbedApi, getClient } from "embed-typescript"

const program = Effect.gen(function* () {
  // Concurrent operations with Effect.all
  const [feed, trending, search] = yield* Effect.all(
    [
      EmbedApi.ForYouReranked({ user_id: "3621", items_list: [] }),
      EmbedApi.Trending({ top_k: 10 }),
      EmbedApi.Search({ query: "AI technology", top_k: 5 })
    ],
    { concurrency: "unbounded" }
  )

  return { feed, trending, search }
})

Effect.runPromise(program.pipe(Effect.provide(getClient())))
```

## API Reference

### Promise-based Client

#### `createMbdClient(token?: string)`

Creates a client. If no token provided, uses `API_KEY_EMBED` environment variable.

#### `MbdPromiseClient` Methods

Available through `client.api.*`:

- `ForYouReranked(params)` - Get personalized feed for a user
- `Search(params)` - Search for content
- `Trending(params)` - Get trending content
- `Popular(params)` - Get popular content
- `Similar(params)` - Get similar content
- `UsersSearch(params)` - Search for users
- `UsersFeedByTopic(params)` - Get user feeds by topic
- `LabelsForText(params)` - Get AI labels for text

### Effect-based Client

#### `EmbedApi`

Pre-built API methods for all endpoints:

- `EmbedApi.ForYouReranked(params)` - Get personalized feed for a user
- `EmbedApi.Search(params)` - Search for content
- `EmbedApi.Trending(params)` - Get trending content
- `EmbedApi.Popular(params)` - Get popular content
- `EmbedApi.Similar(params)` - Get similar content
- `EmbedApi.UsersSearch(params)` - Search for users
- `EmbedApi.UsersFeedByTopic(params)` - Get user feeds by topic
- `EmbedApi.LabelsForText(params)` - Get AI labels for text

### Configuration

The HTTP client automatically sets these headers for all requests:

- `HTTP-Referer`: Your configured referer (default: "https://docs.mbd.xyz/")
- `X-Title`: Your configured title (default: "mbd_docs")
- `accept`: "application/json"
- `content-type`: "application/json"
- `authorization`: "Bearer {your-token}"

### Layer Providers

- `getClient()` - Uses `API_KEY_EMBED` environment variable
- `getClient(token)` - Uses provided token

## Example cURL Equivalent

This TypeScript client is equivalent to making requests like:

```bash
curl --request POST \
     --url https://api.mbd.xyz/v2/farcaster/casts/feed/for-you-reranked \
     --header 'HTTP-Referer: https://docs.mbd.xyz/' \
     --header 'X-Title: mbd_docs' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer TOKEN' \
     --header 'content-type: application/json' \
     --data '{"user_id": "3621", "items_list": []}'
```

But with all the headers and authentication handled automatically!

## Why Choose This SDK?

### 🎯 **Dual API Design**

Choose the API style that fits your team:

- **Promise-based**: Familiar `async/await` syntax for easy adoption
- **Effect-based**: Advanced composition, error handling, and type safety

### 🔧 **Same Reliable Foundation**

Both APIs use the same underlying Effect implementation, ensuring:

- Consistent behavior and reliability
- Automatic header management
- Type-safe HTTP operations
- Robust error handling

### 🚀 **Developer Experience**

- Zero configuration for basic usage (uses environment variables)
- Automatic authentication with Bearer tokens
- All required headers set automatically
- Comprehensive TypeScript support
