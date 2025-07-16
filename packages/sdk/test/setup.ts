// Test setup and configuration
import { beforeAll } from "@effect/vitest"

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

export {}
