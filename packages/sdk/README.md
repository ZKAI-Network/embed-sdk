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
import { getClient } from "@embed-ai/sdk"
const client = getClient(process.env.API_KEY_EMBED)
const feed = await client.feed.byUserId("16085")
console.log("✅ Success we got:", feed.length, "items")
```

## Error Handling Guide

The @embed-ai/sdk package provides comprehensive error handling with typed errors and automatic retries. Here's everything you need to know.

### What Gets Retried Automatically

- ✅ **Network errors** (connection failures, DNS issues)
- ✅ **Timeout errors** (requests taking too long)
- ✅ **Server errors** (500, 502, 503, 504 by default)
- ✅ **Rate limiting** (429 when configured)
- ❌ **Parse errors** (malformed JSON responses)
- ❌ **Client errors** (4xx except when configured)

### Basic Error Handling

For simple applications, basic try/catch is sufficient:

```typescript
import { getClient } from "@embed-ai/sdk"

const client = getClient(process.env.API_KEY_EMBED)

try {
  const feed = await client.feed.byUserId("16085")
  return feed
} catch (error) {
  console.error("API request failed:", error)
  throw error // Re-throw or handle as needed
}
```

### Understanding Error Types

The package exports four specific error types for structured error handling:

```typescript
import {
  HttpRequestError,  // HTTP response errors (4xx, 5xx)
  NetworkError,      // Network connection issues
  TimeoutError,      // Request timeout errors
  ParseError         // JSON parsing errors
} from "@embed-ai/sdk"
```

Each error type contains rich information to help you understand and handle the issue:

```typescript
// HttpRequestError - HTTP response errors
{
  status: 401,                    // HTTP status code
  statusText: "Unauthorized",     // Status text
  url: "https://api.mbd.xyz/...", // Request URL
  body: "Invalid API key"         // Response body (if available)
}

// NetworkError - Connection issues
{
  message: "Failed to fetch",     // Error description
  cause: Error                    // Original error
}

// TimeoutError - Request timeouts
{
  message: "Request timed out",   // Error description
  timeoutMs: 30000               // Timeout duration
}

// ParseError - JSON parsing issues
{
  message: "Failed to parse JSON", // Error description
  cause: SyntaxError              // Original parsing error
}
```

### Basic Usage with Error Handling

```typescript
import { getClient, HttpRequestError, NetworkError, TimeoutError } from "@embed-ai/sdk"

const client = getClient(process.env.API_KEY_EMBED)

try {
  const feed = await client.feed.byUserId("16085")
  console.log("✅ Success:", feed.length, "items")
} catch (error) {
  console.error("❌ Error:", error)
  
  // Handle specific error types
  if (error instanceof HttpRequestError) {
    console.error(`HTTP ${error.status}: ${error.statusText}`)
  } else if (error instanceof NetworkError) {
    console.error("Network connection failed")
  } else if (error instanceof TimeoutError) {
    console.error(`Request timed out after ${error.timeoutMs}ms`)
  }
}
```

### Typed Error Handling

For production applications, use typed error handling for better control:

```typescript
import { 
  getClient, 
  HttpRequestError, 
  NetworkError, 
  TimeoutError, 
  ParseError 
} from "@embed-ai/sdk"

const client = getClient(process.env.API_KEY_EMBED)

async function getFeedWithErrorHandling(userId: string) {
  try {
    return await client.feed.byUserId(userId)
  } catch (error) {
    if (error instanceof HttpRequestError) {
      switch (error.status) {
        case 401:
          throw new Error("Invalid API key - please check your credentials")
        case 403:
          throw new Error("Access denied - check your API permissions")
        case 404:
          throw new Error("User not found")
        case 429:
          throw new Error("Rate limit exceeded - please try again later")
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error("Server error - please try again later")
        default:
          throw new Error(`HTTP error ${error.status}: ${error.statusText}`)
      }
    } else if (error instanceof NetworkError) {
      throw new Error("Network connection failed - check your internet connection")
    } else if (error instanceof TimeoutError) {
      throw new Error(`Request timed out after ${error.timeoutMs}ms`)
    } else if (error instanceof ParseError) {
      throw new Error("Invalid response from server")
    } else {
      throw new Error("Unknown error occurred")
    }
  }
}
```

### Custom Retry Configuration

Configure retry behavior for your specific needs:

```typescript
import { getClient } from "@embed-ai/sdk"

const client = getClient(process.env.API_KEY_EMBED, {
  retry: {
    maxRetries: 5,                    // Max retry attempts
    initialDelay: 1000,               // Initial delay in ms
    exponentialBackoff: true,         // Use exponential backoff
    maxDelay: 15000,                  // Max delay between retries
    retryableStatusCodes: [429, 500, 502, 503, 504], // HTTP codes to retry
    timeoutMs: 60000                  // Request timeout in ms
  }
})

// Now all requests will use this retry configuration
const feed = await client.feed.byWalletAddress("0x123...")
```

### What Happens When Retries Fail

When all retry attempts are exhausted, you receive the **last error that occurred** with full context:

```typescript
try {
  const feed = await client.feed.byUserId("16085")
} catch (error) {
  // This error represents the final failure after all retries
  if (error instanceof HttpRequestError) {
    console.error(`Final HTTP error after retries: ${error.status}`)
    console.error(`Request URL: ${error.url}`)
    console.error(`Response body: ${error.body}`)
  } else if (error instanceof NetworkError) {
    console.error(`Final network error after retries: ${error.message}`)
  }
}
```

**Error Flow:**
1. **Request made** → Network fails
2. **Retry 1** → Network fails  
3. **Retry 2** → Network fails
4. **Retry 3** → Network fails
5. **Final error** → `NetworkError` with original failure details

### Error Handling Best Practices

#### 1. **Use Typed Error Handling in Production**

```typescript
// ✅ Good - Specific error handling
try {
  const feed = await client.feed.byUserId(userId)
} catch (error) {
  if (error instanceof HttpRequestError) {
    // Handle specific HTTP errors
  } else if (error instanceof NetworkError) {
    // Handle network issues
  }
}

// ❌ Avoid - Generic error handling
try {
  const feed = await client.feed.byUserId(userId)
} catch (error) {
  console.error("Something went wrong:", error) // Too generic
}
```

#### 2. **Provide User-Friendly Error Messages**

```typescript
function getUserFriendlyError(error: unknown): string {
  if (error instanceof HttpRequestError) {
    switch (error.status) {
      case 401: return "Please check your API key"
      case 429: return "Too many requests - please wait a moment"
      case 500: return "Server is temporarily unavailable"
      default: return "Something went wrong with the request"
    }
  } else if (error instanceof NetworkError) {
    return "Please check your internet connection"
  } else if (error instanceof TimeoutError) {
    return "Request took too long - please try again"
  }
  return "An unexpected error occurred"
}
```

#### 3. **Implement Cache Strategies**

```typescript
async function getFeedWithCache(userId: string) {
  try {
    return await client.feed.byUserId(userId)
  } catch (error) {
    if (error instanceof HttpRequestError && error.status === 404) {
      // User not found - return empty feed
      return []
    } else if (error instanceof NetworkError || error instanceof TimeoutError) {
      // Network issues - return cached data if available
      return getCachedFeed(userId) || []
    }
    throw error // Re-throw other errors
  }
}
```

#### 4. **Log Errors for Monitoring**

```typescript
import { getClient, HttpRequestError } from "@embed-ai/sdk"

const client = getClient(process.env.API_KEY_EMBED)

async function getFeedWithLogging(userId: string) {
  try {
    return await client.feed.byUserId(userId)
  } catch (error) {
    // Log error details for monitoring
    if (error instanceof HttpRequestError) {
      console.error("API Error:", {
        status: error.status,
        url: error.url,
        userId,
        timestamp: new Date().toISOString()
      })
    }
    throw error
  }
}
```

## API Methods

### Available Methods

```typescript
// Get personalized "For You" feed by user ID
await client.feed.byUserId(userId: string, options?: FeedOptions)

// Get personalized "For You" feed by wallet address
await client.feed.byWalletAddress(walletAddress: string, options?: FeedOptions)

// Feed management to create new feeds and manage these custom feeds e.g. as custom feed per user in your app, which can be built on top of base feeds
await client.feed.createConfig(options: CreateFeedOptions)
await client.feed.getConfig(configId: string)
await client.feed.listConfigs(visibility?: "private" | "public")
await client.feed.updateConfig(options: UpdateFeedOptions)
```

### Factory Function

```typescript
import { getClient } from "@embed-ai/sdk"

// Create client with factory function
const client = getClient(process.env.API_KEY_EMBED, {
  retry: { maxRetries: 5 }
})
```


## Why Effect?

- **Structured Error Handling**: Type-safe error channels prevent runtime surprises
- **Composable**: Chain and combine operations with powerful combinators
- **Reliable**: Automatic retries handle transient failures gracefully
- **Observable**: Built-in logging and tracing for debugging
- **Type-Safe**: Full TypeScript support with inferred types
