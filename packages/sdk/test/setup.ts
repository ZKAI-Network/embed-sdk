// Test setup and configuration
import { beforeAll } from "@effect/vitest"
import type { mbdClientConfig } from "../src/index.js"
import { getClient } from "../src/index.js"

beforeAll(() => {
  // Check for required environment variables
  const apiKey = process.env.API_KEY_EMBED

  if (!apiKey) {
    console.warn("⚠️  No API key found in environment variables.")
    console.warn("   Set API_KEY_EMBED to run integration tests.")
    console.warn("   Tests will be skipped if no API key is provided.")
  } else {
    console.log("✅ API key found - integration tests will run")
  }

  // Log test environment info
  console.log("🧪 SDK Test Environment:")
  console.log(`   Node.js: ${process.version}`)
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`   API Key: ${apiKey ? "✅ Present" : "❌ Missing"}`)
})

/**
 * Create a test client with standard retry configuration
 */
export const getTestClient = (apiKey: string) => {
  return getClient(apiKey)
}

/**
 * Create a test client with reduced retry configuration for faster error handling tests
 */
export const getFastFailClient = (apiKey: string) => {
  const fastFailConfig: mbdClientConfig = {
    retry: {
      maxRetries: 1, // Only retry once
      initialDelay: 500, // Shorter delay
      exponentialBackoff: false, // No exponential backoff
      timeoutMs: 10000 // 10 second timeout instead of 30
    }
  }
  return getClient(apiKey, fastFailConfig)
}

export {}
