# Embed TypeScript

The core TypeScript package for embed APIs, featuring an Effect-based HTTP client with robust error handling and configurable retry logic for mbd.xyz API.

## Features

- 🚀 **Effect-based HTTP client** with structured error handling
- 🔄 **Configurable retry logic** with exponential backoff
- 🛡️ **Type-safe error handling** with tagged error types
- ⏱️ **Request timeouts** with proper timeout handling
- 🔐 **Automatic authentication** with Bearer tokens
- 📝 **All required headers** set automatically
- 📊 **Built-in logging** of failed requests and retries
- 🎯 **Selective retry logic** for different error types

## Quick Start

### Basic Usage

```typescript
import { mbdClient } from "embed-typescript"

// Simple usage with default retry configuration
const client = new mbdClient(process.env.API_KEY_EMBED)

try {
  const feed = await client.getFeedByUserId("16085")
  console.log("Success:", feed)
} catch (error) {
  console.error("Error:", error)
}
```

### What Gets Retried
- ✅ Network errors (connection failures, DNS issues)
- ✅ Timeout errors
- ✅ Configurable HTTP status codes (500, 502, 503, 504 by default)
- ✅ Rate limiting (429) when configured
- ❌ Parse errors (malformed JSON)
- ❌ Client errors (4xx except when configured)

### Custom Retry Configuration

```typescript
import { mbdClient } from "embed-typescript"

const client = new mbdClient(process.env.API_KEY_EMBED, {
  baseUrl: "https://api.mbd.xyz",
  retry: {
    maxRetries: 5,                    // Max retry attempts (default: 3)
    initialDelay: 1000,               // Initial delay in ms (default: 1000)
    exponentialBackoff: true,         // Use exponential backoff (default: true)
    maxDelay: 15000,                  // Max delay in ms (default: 10000)
    retryableStatusCodes: [429, 500, 502, 503, 504], // HTTP codes to retry
    timeoutMs: 60000                  // Request timeout in ms (default: 30000)
  }
})

const feed = await client.getFeedByWalletAddress("0x123...")
```

## Error Handling

The client exports specific error types for structured error handling:

```typescript
import {
  mbdClient,
  HttpRequestError,
  NetworkError,
  TimeoutError,
  ParseError
} from "embed-typescript"

const client = new mbdClient("your-token")

try {
  const feed = await client.getFeedByUserId("16085")
} catch (error) {
  if (error instanceof HttpRequestError) {
    console.error(`HTTP Error: ${error.status} ${error.statusText}`)
    console.error(`URL: ${error.url}`)
  } else if (error instanceof NetworkError) {
    console.error(`Network Error: ${error.message}`)
  } else if (error instanceof TimeoutError) {
    console.error(`Timeout Error: ${error.message} (${error.timeoutMs}ms)`)
  } else if (error instanceof ParseError) {
    console.error(`Parse Error: ${error.message}`)
  }
}
```

## API Methods

### Available Methods

```typescript
// Get personalized "For You" feed by user ID
await client.getFeedByUserId(userId: string, options?: ForYouOptions)

// Get personalized "For You" feed by wallet address
await client.getFeedByWalletAddress(walletAddress: string, options?: ForYouOptions)
```

### Factory Function

```typescript
import { getClient } from "embed-typescript"

// Create client with factory function
const client = getClient(process.env.API_KEY_EMBED)
```

## Examples

Run the comprehensive examples to see all features in action:

```bash
# Basic example with default retries
bun run examples/retry-example.ts
```

## Why Effect?

- **Structured Error Handling**: Type-safe error channels prevent runtime surprises
- **Composable**: Chain and combine operations with powerful combinators
- **Reliable**: Automatic retries handle transient failures gracefully
- **Observable**: Built-in logging and tracing for debugging
- **Type-Safe**: Full TypeScript support with inferred types
