# Simple SDK Samples

This directory contains simple, standalone examples demonstrating how to use the Embed SDK. These examples are designed to be easy to understand and run independently.

## Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- An Embed AI API key

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```
   
   > **Note:** This example already includes `effect` as a dependency, which is required since `@embed-ai/sdk` now uses `effect` as a peer dependency.

2. **Set up environment variables:**
   Create a `.env` file in this directory:
   ```bash
   API_KEY_EMBED=your_embed_api_key_here
   ```

## Examples

### 1. Basic SDK Usage (`embed-typescript-sdk.ts`)

A minimal example showing how to initialize the SDK client and fetch a feed for a specific user.

```bash
bun run embed-typescript-sdk.ts
```

**What it does:**
- Initializes the SDK client with your API key
- Fetches a feed for user ID "16085" with top 10 items
- Displays the results in the console

### 2. Feed Management (`feed-management-example.ts`)

A comprehensive example demonstrating feed creation, listing, retrieval, and updates.

```bash
bun run feed-management-example.ts
```

**What it does:**
- Creates a new feed configuration with custom filters
- Lists all available feeds
- Retrieves details for a specific feed
- Updates the feed with new configuration
- Shows before/after changes

### 3. User Search Examples

Examples demonstrating user search functionality:

- **`search-users-similar.ts`** - Find similar users based on a user ID
- **`search-users-by-query.ts`** - Search users by semantic query
- **`search-users-top-by-label.ts`** - Get top users by AI label
- **`search-users-get-labels.ts`** - Get AI labels for specific users

```bash
bun run search-users-by-query.ts
bun run search-users-similar.ts
```

### 4. Posts Search Examples

Examples demonstrating posts/casts search functionality:

- **`search-posts-by-query.ts`** - Search posts by semantic query
- **`search-posts-get-labels.ts`** - Get AI labels for specific posts
- **`search-posts-comprehensive.ts`** - Comprehensive demo of all posts search features

```bash
bun run search-posts-by-query.ts
bun run search-posts-get-labels.ts
bun run search-posts-comprehensive.ts
```

**What these examples show:**
- Semantic search for posts/casts with various options
- Retrieving AI labels (moderation, topics, sentiment, emotion)
- Advanced filtering by timestamp, AI labels, channels, etc.
- Different configurations and error handling

### 5. Retry Logic (`retry-example.ts`)

Advanced examples showing different retry configurations and error handling strategies.

```bash
bun run retry-example.ts
```

**What it includes:**
- Basic usage with default retry configuration
- Custom retry settings (exponential backoff, custom delays)
- No-retry configuration for immediate failure testing
- Specific error type handling (HTTP, Network, Timeout errors)
- Advanced error handling using the Effect library
