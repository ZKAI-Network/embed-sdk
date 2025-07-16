// Import all test suites
import "./search-posts.test.js"
import "./search-users.test.js"
import "./feed.test.js"

// This serves as the main test suite entry point
// All actual tests are defined in individual files:
// - search-posts.test.ts: Tests for search.posts namespace
// - search-users.test.ts: Tests for search.users namespace
// - feed.test.ts: Tests for feed namespace (generation + management)

// Tests validate:
// ✅ Endpoint calls succeed without error
// ✅ Return types match TypeScript definitions
// ✅ Response structure is correct
// ✅ Error handling works gracefully
// ✅ All major functionality is covered

console.log("🧪 Running comprehensive SDK test suite...")
console.log("📊 Testing search.posts namespace")
console.log("👥 Testing search.users namespace")
console.log("📰 Testing feed namespace")
console.log("🔍 All tests validate endpoints and type safety")
