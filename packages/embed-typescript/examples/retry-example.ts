import { Effect } from "effect"
import { HttpRequestError, mbdClient, NetworkError, TimeoutError } from "../src/client.js"

/**
 * Example demonstrating basic usage with default retry configuration
 */
async function basicExample() {
  console.log("=== Basic Example with Default Retries ===")

  const client = new mbdClient(process.env.API_KEY_EMBED, {
    baseUrl: "https://api.mbd.xyz"
  })

  try {
    const feed = await client.getFeedByUserId("16085")
    console.log("Success:", feed)
  } catch (error) {
    console.error("Error:", error)
  }
}

/**
 * Example demonstrating custom retry configuration
 */
async function customRetryExample() {
  console.log("\n=== Custom Retry Configuration Example ===")

  const client = new mbdClient(process.env.API_KEY_EMBED, {
    baseUrl: "https://api.mbd.xyz",
    retry: {
      maxRetries: 5,
      initialDelay: 500,
      exponentialBackoff: true,
      maxDelay: 15000,
      retryableStatusCodes: [429, 500, 502, 503, 504],
      timeoutMs: 60000
    }
  })

  try {
    const feed = await client.getFeedByWalletAddress("0x09CEdb7bb69f9F6DF646dBa107D2bAACda93D6C9")
    console.log("Success with custom retry config:", feed)
  } catch (error) {
    console.error("Error after custom retries:", error)
  }
}

/**
 * Example demonstrating no retries (immediate failure)
 */
async function noRetryExample() {
  console.log("\n=== No Retry Example ===")

  const client = new mbdClient(process.env.API_KEY_EMBED, {
    baseUrl: "https://api.mbd.xyz",
    retry: {
      maxRetries: 0,
      timeoutMs: 5000
    }
  })

  try {
    const feed = await client.getFeedByUserId("16085")
    console.log("Success without retries:", feed)
  } catch (error) {
    console.error("Immediate failure:", error)
  }
}

/**
 * Example demonstrating error handling with specific error types
 */
async function errorHandlingExample() {
  console.log("\n=== Error Handling Example ===")

  const client = new mbdClient("invalid-token", {
    baseUrl: "https://api.mbd.xyz"
  })

  try {
    const feed = await client.getFeedByUserId("16085")
    console.log("Unexpected success:", feed)
  } catch (error) {
    // Handle specific error types
    if (error instanceof HttpRequestError) {
      console.error(`HTTP Error: ${error.status} ${error.statusText}`)
      console.error(`URL: ${error.url}`)
      if (error.body) {
        console.error(`Response body: ${error.body}`)
      }
    } else if (error instanceof NetworkError) {
      console.error(`Network Error: ${error.message}`)
    } else if (error instanceof TimeoutError) {
      console.error(`Timeout Error: ${error.message} (${error.timeoutMs}ms)`)
    } else {
      console.error("Unknown error:", error)
    }
  }
}

/**
 * Example demonstrating Effect-based error handling for advanced use cases
 */
async function advancedEffectExample() {
  console.log("\n=== Advanced Effect Example ===")

  const client = new mbdClient(process.env.API_KEY_EMBED, {
    baseUrl: "https://api.mbd.xyz"
  })

  // Create an Effect that wraps the API call
  const apiCall = Effect.tryPromise({
    try: () => client.getFeedByUserId("16085"),
    catch: (error) => error
  })

  // Handle errors using Effect's error handling capabilities
  const program = Effect.gen(function*() {
    const result = yield* Effect.catchTags(apiCall, {
      HttpRequestError: (error) => {
        console.log(`Handling HTTP error: ${error.status}`)
        return Effect.succeed({ fallback: true, error: error.status })
      },
      NetworkError: (error) => {
        console.log(`Handling network error: ${error.message}`)
        return Effect.succeed({ fallback: true, error: "network" })
      },
      TimeoutError: (error) => {
        console.log(`Handling timeout: ${error.timeoutMs}ms`)
        return Effect.succeed({ fallback: true, error: "timeout" })
      }
    })

    return result
  })

  try {
    const result = await Effect.runPromise(program)
    console.log("Advanced result:", result)
  } catch (error) {
    console.error("Unhandled error:", error)
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  await basicExample()
  await customRetryExample()
  await noRetryExample()
  await errorHandlingExample()
  await advancedEffectExample()
}

// Export examples for use in other files
export { advancedEffectExample, basicExample, customRetryExample, errorHandlingExample, noRetryExample, runExamples }

// Run examples if this file is executed directly
if (import.meta.url === new URL(import.meta.resolve(import.meta.url)).href) {
  runExamples().catch(console.error)
}
