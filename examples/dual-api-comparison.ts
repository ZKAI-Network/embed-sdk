/**
 * USAGE RECOMMENDATIONS:
 *
 * 🌍 ENVIRONMENT SETUP:
 * - Set API_KEY_EMBED environment variable with your mbd.xyz token
 * - Both Effect and Promise APIs will automatically use this token
 * - No need to pass tokens explicitly in your code
 *
 * 🎯 Choose Promise-based API when:
 * - Your team is more familiar with async/await
 * - Integrating with existing Promise-based codebases
 * - You want simple, straightforward HTTP requests
 * - You prefer standard try/catch error handling
 *
 * ⚡ Choose Effect-based API when:
 * - You want advanced error handling and retries
 * - You need complex operation composition
 * - You want built-in timeout and scheduling
 * - You're building Effect-based applications
 * - You want maximum type safety and composability
 */

import { Effect, Schedule } from "effect"
import { EmbedApi, getClient } from "../packages/embed-typescript/src/client-effect.js"
import { createMbdClient } from "../packages/embed-typescript/src/client.js"

/**
 * Comprehensive comparison of Effect-based vs Promise-based APIs
 * Both use the same underlying Effect implementation for reliability
 * Token is loaded from API_KEY_EMBED environment variable
 */

console.log("🚀 Dual API Comparison: Effect vs Promise")
console.log("============================================================")

/**
 * EFFECT-BASED API EXAMPLES
 */
console.log("\n⚡ EFFECT-BASED API (Powerful & Composable)")
console.log("------------------------------------------------------------")

// Effect-based: Composable and type-safe
const effectBasedExample = Effect.gen(function*() {
  console.log("📡 Effect: Getting feed with composable operations...")

  // You can compose multiple operations using the EmbedApi
  const feed = yield* EmbedApi.ForYou({ limit: 10 })

  // Easy error handling and retries
  const customData = yield* EmbedApi.post("/v2/farcaster/casts/feed/for-you", {
    limit: 5
  }).pipe(
    Effect.retry({ times: 2 }), // Built-in retry logic
    Effect.catchAll(() => Effect.succeed({ fallback: "data" })) // Graceful fallback
  )

  return { feed, customData }
})

/**
 * PROMISE-BASED API EXAMPLES
 */
console.log("\n🎯 PROMISE-BASED API (Familiar & Easy)")
console.log("------------------------------------------------------------")

async function promiseBasedExample() {
  console.log("📡 Promise: Getting feed with familiar async/await...")

  // Using environment variable - no token parameter uses API_KEY_EMBED from env
  const client = createMbdClient()

  try {
    // Familiar async/await syntax
    const feed = await client.api.ForYou({ limit: 10 })

    // Easy to use with existing Promise-based code
    const customData = await client.api.post("/v2/farcaster/casts/feed/for-you", {
      limit: 5
    })

    return { feed, customData }
  } catch (error) {
    // Standard try/catch error handling
    console.log("Handled error:", error instanceof Error ? error.message : String(error))
    return { fallback: "data" }
  }
}

/**
 * CONCURRENT OPERATIONS COMPARISON
 */
console.log("\n🔄 CONCURRENT OPERATIONS")
console.log("------------------------------------------------------------")

// Effect-based concurrent operations
const effectConcurrent = Effect.gen(function*() {
  console.log("⚡ Effect: Running concurrent operations...")

  // Effect.all for concurrent execution
  const [feed, trending, popular] = yield* Effect.all([
    EmbedApi.ForYou({ limit: 3 }),
    EmbedApi.Trending({ limit: 3 }),
    EmbedApi.Popular({ limit: 3 })
  ], { concurrency: "unbounded" })

  return { feed, trending, popular }
})

async function promiseConcurrent() {
  console.log("🎯 Promise: Running concurrent operations...")

  // Using environment variable - no token parameter uses API_KEY_EMBED from env
  const client = createMbdClient()

  // Promise.all for concurrent execution
  const [feed, trending, popular] = await Promise.all([
    client.api.ForYou({ limit: 3 }),
    client.api.Trending({ limit: 3 }),
    client.api.Popular({ limit: 3 })
  ])

  return { feed, trending, popular }
}

/**
 * ERROR HANDLING COMPARISON
 */
console.log("\n❌ ERROR HANDLING")
console.log("------------------------------------------------------------")

// Effect-based error handling
const effectErrorHandling = Effect.gen(function*() {
  console.log("⚡ Effect: Advanced error handling...")

  const result = yield* EmbedApi.ForYou({ limit: 10 }).pipe(
    Effect.timeout("5 seconds"), // Built-in timeout
    Effect.retry({ times: 3, schedule: Schedule.exponential("100 millis") }), // Exponential backoff
    Effect.catchAll((error) => Effect.succeed({ error: String(error) }))
  )

  return result
})

async function promiseErrorHandling() {
  console.log("🎯 Promise: Standard error handling...")

  // Using environment variable - no token parameter uses API_KEY_EMBED from env
  const client = createMbdClient()
  const feed = await client.api.ForYou({ limit: 10 })
  console.log(feed)

  try {
    // Manual timeout implementation
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))

    const result = await Promise.race([
      client.api.ForYou({ limit: 10 }),
      timeoutPromise
    ])

    return result
  } catch (error) {
    if (error instanceof Error && error.message === "Timeout") {
      return { timeout: true }
    }
    return { error: String(error) }
  }
}

/**
 * RUN ALL EXAMPLES
 */
async function runAllExamples() {
  console.log("\n🚀 Running all examples...\n")

  // Using environment variable - no parameter uses API_KEY_EMBED from env
  const clientLayer = getClient()

  // Run Effect-based examples
  try {
    const effectResult = await Effect.runPromise(
      effectBasedExample.pipe(Effect.provide(clientLayer))
    )
    console.log("✅ Effect-based result:", effectResult)
  } catch (error) {
    console.log("❌ Effect-based error:", error instanceof Error ? error.message : String(error))
  }

  // Run Promise-based examples
  try {
    const promiseResult = await promiseBasedExample()
    console.log("✅ Promise-based result:", promiseResult)
  } catch (error) {
    console.log("❌ Promise-based error:", error instanceof Error ? error.message : String(error))
  }

  // Run concurrent examples
  try {
    const effectConcurrentResult = await Effect.runPromise(
      effectConcurrent.pipe(Effect.provide(clientLayer))
    )
    console.log("✅ Effect concurrent result:", effectConcurrentResult)
  } catch (error) {
    console.log("❌ Effect concurrent error:", error instanceof Error ? error.message : String(error))
  }

  try {
    const promiseConcurrentResult = await promiseConcurrent()
    console.log("✅ Promise concurrent result:", promiseConcurrentResult)
  } catch (error) {
    console.log("❌ Promise concurrent error:", error instanceof Error ? error.message : String(error))
  }

  // Run error handling examples
  try {
    const effectErrorResult = await Effect.runPromise(
      effectErrorHandling.pipe(Effect.provide(clientLayer))
    )
    console.log("✅ Effect error handling result:", effectErrorResult)
  } catch (error) {
    console.log("❌ Effect error handling error:", error instanceof Error ? error.message : String(error))
  }

  try {
    const promiseErrorResult = await promiseErrorHandling()
    console.log("✅ Promise error handling result:", promiseErrorResult)
  } catch (error) {
    console.log("❌ Promise error handling error:", error instanceof Error ? error.message : String(error))
  }

  console.log("\n🎉 Comparison completed!")
  console.log("\n📋 SUMMARY:")
  console.log("⚡ Effect-based API: More powerful, composable, built-in error handling & retries")
  console.log("🎯 Promise-based API: Familiar syntax, easy to integrate with existing code")
  console.log("🔧 Both APIs: Use the same reliable Effect implementation under the hood")
  console.log("🌍 Environment: Token loaded from API_KEY_EMBED environment variable")
  console.log("✨ Choose the API that best fits your team's preferences and requirements!")
}

// Execute the comparison
runAllExamples()
  .then(() => {
    console.log("\n✅ Dual API demonstration completed successfully!")
  })
  .catch((error) => {
    console.error("\n💥 Demonstration failed:", error)
  })
