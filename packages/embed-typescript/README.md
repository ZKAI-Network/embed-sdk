# Embed TypeScript

The core TypeScript package for embed APIs, featuring a pre-configured HTTP client for mbd.xyz API.

## Features

- 🚀 Pre-configured HTTP client for mbd.xyz API
- 🔐 Automatic authentication with Bearer tokens
- 📝 All required headers set automatically
- 🎯 **Dual API**: Choose between Effect-based or Promise-based clients
- ⚙️ Configurable base URL, referer, and title
- 🔧 Same reliable Effect implementation under the hood

## Quick Start

Choose your preferred API style:

### Option 1: Promise-based API (Familiar & Easy)

```typescript
import { createMbdClient } from "embed-typescript"

// Simple usage with async/await
const client = createMbdClient("your-token-here")

// Get the "for you" feed
const feed = await client.getForYouFeed()
console.log(feed)

// Make custom requests
const response = await client.post("/v2/farcaster/casts/feed/for-you", {
  limit: 10
})
```

### Option 2: Effect-based API (Powerful & Composable)

```typescript
import { Effect } from "effect"
import { MbdApi, makeMbdClientLayerWithToken } from "embed-typescript"

// Simple usage with just a token
const program = Effect.gen(function* () {
  // Get the "for you" feed from Farcaster
  const feed = yield* MbdApi.getForYouFeed
  console.log(feed)
})

// Run the program with your token
Effect.runPromise(
  program.pipe(Effect.provide(makeMbdClientLayerWithToken("your-token-here")))
)
```

### Advanced Configuration

#### Promise-based Configuration

```typescript
import { createMbdClientWithConfig } from "embed-typescript"

const client = createMbdClientWithConfig({
  baseUrl: "https://api.mbd.xyz",
  token: "your-token-here",
  referer: "https://your-app.com",
  title: "your-app-name"
})

// Use with async/await
const response = await client.post("/v2/farcaster/casts/feed/for-you", {
  // your request body
})

// Or with Promise.all for concurrent requests
const [feed, posts] = await Promise.all([
  client.getForYouFeed(),
  client.get("/v2/posts")
])
```

#### Effect-based Configuration

```typescript
import { Effect } from "effect"
import { MbdApi, makeMbdClientLayer } from "embed-typescript"

const customConfig = {
  baseUrl: "https://api.mbd.xyz",
  token: "your-token-here",
  referer: "https://your-app.com",
  title: "your-app-name"
}

const program = Effect.gen(function* () {
  // Make custom API calls
  const response = yield* MbdApi.post("/v2/farcaster/casts/feed/for-you", {
    // your request body
  })

  return response
})

Effect.runPromise(
  program.pipe(Effect.provide(makeMbdClientLayer(customConfig)))
)
```

## API Reference

### Promise-based Client

#### `createMbdClient(token: string)`

Creates a simple client with just a token using default configuration.

#### `createMbdClientWithConfig(config: MbdApiConfig)`

Creates a client with full configuration options.

#### `MbdPromiseClient` Methods

- `getForYouFeed(): Promise<unknown>` - Get the "for you" feed
- `post(endpoint: string, body?: unknown): Promise<unknown>` - Make POST requests
- `get(endpoint: string): Promise<unknown>` - Make GET requests

### Effect-based Client

### MbdApi

Pre-built API methods for common endpoints:

- `MbdApi.getForYouFeed` - Get the "for you" feed from Farcaster casts
- `MbdApi.post(endpoint, body?)` - Make a POST request to any endpoint
- `MbdApi.get(endpoint)` - Make a GET request to any endpoint

### Configuration

The HTTP client automatically sets these headers for all requests:

- `HTTP-Referer`: Your configured referer (default: "https://docs.mbd.xyz/")
- `X-Title`: Your configured title (default: "mbd_docs")
- `accept`: "application/json"
- `content-type`: "application/json"
- `authorization`: "Bearer {your-token}"

### Layer Providers

- `makeMbdClientLayerWithToken(token)` - Quick setup with default config
- `makeMbdClientLayer(config)` - Full configuration control

## Example cURL Equivalent

This TypeScript client is equivalent to making requests like:

```bash
curl --request POST \
     --url https://api.mbd.xyz/v2/farcaster/casts/feed/for-you \
     --header 'HTTP-Referer: https://docs.mbd.xyz/' \
     --header 'X-Title: mbd_docs' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer TOKEN' \
     --header 'content-type: application/json'
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

- Zero configuration for basic usage
- Automatic authentication with Bearer tokens
- All required headers set automatically
- Comprehensive TypeScript support
