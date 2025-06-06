/**
 * Embed API Showcase: ForYou Feed, Search & Recommendations
 *
 * Demonstrates three core capabilities using both APIs:
 * 1. ForYou Feed - Personalized content feed
 * 2. Search - Find relevant content
 * 3. Recommendations - Discover similar content
 *
 * Setup: Set API_KEY_EMBED environment variable with your mbd.xyz token
 */

import { Effect } from "effect"
import { EmbedApi, getClient } from "../src/client-effect.js"
import { createMbdClient } from "../src/client.js"

// Colors for better output
const colors = {
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  dim: "\x1b[2m"
}

console.log("Dual API Showcase: ForYou Feed, Search & Recommendations")
console.log("========================================================")

/**
 * Promise-based API (Familiar async/await)
 */
console.log(`\n${colors.blue}Promise-based API${colors.reset}`)
console.log("-----------------")

async function promiseApiShowcase() {
  const client = createMbdClient() // Uses API_KEY_EMBED from environment

  try {
    console.log("Getting personalized ForYou feed...")
    const forYouFeed = await client.api.ForYouReranked({
      user_id: "3621", // Popular Farcaster user
      items_list: []
    })

    console.log("Searching for crypto content...")
    const searchResults = await client.api.Search({
      query: "crypto blockchain",
      top_k: 5
    })

    console.log("Getting trending recommendations...")
    const recommendations = await client.api.Trending({
      top_k: 5
    })

    console.log(`${colors.green}Promise API Results:${colors.reset}`)
    console.log(`${colors.cyan}ForYou Feed:${colors.reset}`)
    console.log(JSON.stringify(forYouFeed, null, 2).slice(0, 500) + "...")

    console.log(`${colors.cyan}Search Results:${colors.reset}`)
    console.log(JSON.stringify(searchResults, null, 2).slice(0, 500) + "...")

    console.log(`${colors.cyan}Recommendations:${colors.reset}`)
    console.log(JSON.stringify(recommendations, null, 2).slice(0, 500) + "...")

    return { forYouFeed, searchResults, recommendations }
  } catch (error) {
    console.log(
      `${colors.yellow}Promise API Error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/**
 * Effect-based API (Powerful composition)
 */
console.log(`\n${colors.blue}Effect-based API${colors.reset}`)
console.log("----------------")

const effectApiShowcase = Effect.gen(function*() {
  console.log("Getting personalized ForYou feed...")
  const forYouFeed = yield* EmbedApi.ForYouReranked({
    user_id: "3621", // Popular Farcaster user
    items_list: []
  })

  console.log("Searching for crypto content...")
  const searchResults = yield* EmbedApi.Search({
    query: "crypto blockchain",
    top_k: 5
  })

  console.log("Getting trending recommendations...")
  const recommendations = yield* EmbedApi.Trending({
    top_k: 5
  })

  console.log(`${colors.green}Effect API Results:${colors.reset}`)
  console.log(`${colors.cyan}ForYou Feed:${colors.reset}`)
  console.log(JSON.stringify(forYouFeed, null, 2).slice(0, 500) + "...")

  console.log(`${colors.cyan}Search Results:${colors.reset}`)
  console.log(JSON.stringify(searchResults, null, 2).slice(0, 500) + "...")

  console.log(`${colors.cyan}Recommendations:${colors.reset}`)
  console.log(JSON.stringify(recommendations, null, 2).slice(0, 500) + "...")

  return { forYouFeed, searchResults, recommendations }
})

/**
 * Concurrent Operations - All three operations at once
 */
console.log(`\n${colors.blue}Concurrent Operations${colors.reset}`)
console.log("---------------------")

// Promise-based concurrent execution
async function promiseConcurrentShowcase() {
  const client = createMbdClient()

  console.log("Promise: Running all three operations concurrently...")

  const [forYouFeed, searchResults, recommendations] = await Promise.all([
    client.api.ForYouReranked({ user_id: "3621", items_list: [] }),
    client.api.Search({ query: "AI technology", top_k: 3 }),
    client.api.Popular({ top_k: 3 })
  ])

  console.log(`${colors.green}Promise Concurrent Results:${colors.reset}`)
  console.log("Combined results:")
  console.log(JSON.stringify({ forYouFeed, searchResults, recommendations }, null, 2).slice(0, 800) + "...")

  return { forYouFeed, searchResults, recommendations }
}

// Effect-based concurrent execution
const effectConcurrentShowcase = Effect.gen(function*() {
  console.log("Effect: Running all three operations concurrently...")

  const [forYouFeed, searchResults, recommendations] = yield* Effect.all([
    EmbedApi.ForYouReranked({ user_id: "3621", items_list: [] }),
    EmbedApi.Search({ query: "AI technology", top_k: 3 }),
    EmbedApi.Popular({ top_k: 3 })
  ], { concurrency: "unbounded" })

  console.log(`${colors.green}Effect Concurrent Results:${colors.reset}`)
  console.log("Combined results:")
  console.log(JSON.stringify({ forYouFeed, searchResults, recommendations }, null, 2).slice(0, 800) + "...")

  return { forYouFeed, searchResults, recommendations }
})

/**
 * Run the showcase
 */
async function runShowcase() {
  const clientLayer = getClient() // Uses API_KEY_EMBED from environment

  console.log("\nRunning showcase...")

  // 1. Promise API Showcase
  await promiseApiShowcase()

  // 2. Effect API Showcase
  try {
    await Effect.runPromise(
      effectApiShowcase.pipe(Effect.provide(clientLayer))
    )
  } catch (error) {
    console.log(
      `${colors.yellow}Effect API Error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    )
  }

  // 3. Concurrent Operations
  try {
    await promiseConcurrentShowcase()
  } catch (error) {
    console.log(
      `${colors.yellow}Promise Concurrent Error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    )
  }

  try {
    await Effect.runPromise(
      effectConcurrentShowcase.pipe(Effect.provide(clientLayer))
    )
  } catch (error) {
    console.log(
      `${colors.yellow}Effect Concurrent Error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    )
  }

  console.log(`\n${colors.green}Showcase Complete${colors.reset}`)
  console.log(`\n${colors.cyan}Summary:${colors.reset}`)
  console.log("Promise API: Familiar async/await syntax, easy to integrate")
  console.log("Effect API: Powerful composition, built-in error handling & retries")
  console.log("Both APIs: Support concurrent operations for better performance")
  console.log("Three Core Features: ForYou Feed, Search, and Recommendations")
  console.log("Setup: Just set API_KEY_EMBED environment variable")
}

// Execute the showcase
runShowcase()
  .then(() => {
    console.log(`\n${colors.green}Showcase completed successfully${colors.reset}`)
  })
  .catch((error) => {
    console.error(`\n${colors.yellow}Showcase failed:${colors.reset}`, error)
  })
