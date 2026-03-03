# SDK Test Suite Structure

## Overview
This test suite provides comprehensive testing for the Embed AI SDK, covering all major namespaces and functionality. Tests are designed to validate both API integration and type safety.

## File Organization

### Core Files
- **`setup.ts`** - Test configuration, environment setup, and client factory functions
- **`index.test.ts`** - Main test entry point that imports all test modules

### Test Modules
- **`feed.test.ts`** - Feed generation (byUserId, byWalletAddress) and management (CRUD operations)
- **`search-posts.test.ts`** - Post semantic search and labeling functionality
- **`search-users.test.ts`** - User search, similarity, and labeling functionality  
- **`datasource.test.ts`** - Datasource creation, data ingestion, and interaction tracking

## Adding New Tests

### 1. For New Endpoints
1. Add to appropriate namespace test file
2. Include both success and error handling tests
3. Validate response structure and types
4. Add type validation test with explicit casting

### 2. For New Namespaces
1. Create new `{namespace}.test.ts` file
2. Follow existing patterns from other test files
3. Import in `index.test.ts`
4. Add comprehensive coverage for all methods

### 3. Test Naming Convention
```typescript
testCondition("methodName - description of what it tests", () => ...)
```
## Test Structure Patterns

### Effect-based Testing with @effect/vitest

This test suite uses `@effect/vitest` for Effect-based testing. For comprehensive documentation on Effect testing patterns, see `/agents/effect-vitest.md`.

```typescript
import { describe, expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import { Exit } from "effect"

testCondition("test name", () =>
  Effect.gen(function*() {
    const client = createClient()!
    const result = yield* Effect.tryPromise(() => client.someMethod())
    expect(result).toBeDefined()
  }))
```

**Key @effect/vitest Features Used:**
- `it.effect` - Automatically provides TestContext and manages Effect execution
- `it.effect.skip` - Conditionally skip tests (used for missing API keys)
- `Effect.exit` - Capture both success and failure cases for error handling tests
- TestClock integration available but not currently used in this suite

### Conditional Test Execution
Tests skip automatically when `API_KEY_EMBED` environment variable is not set:
```typescript
const apiKey = process.env.API_KEY_EMBED
const testCondition = apiKey ? it.effect : it.effect.skip
```

### Client Configuration
Two client types available:
- **Standard Client**: `getTestClient(apiKey)` - Normal retry configuration
- **Fast-Fail Client**: `getFastFailClient(apiKey)` - Reduced retries for error handling tests

## Test Categories

### 1. Integration Tests
- Validate API endpoints work correctly
- Check response structure matches expected format
- Verify successful data flow

### 2. Type Validation Tests
- Ensure TypeScript types match runtime responses
- Validate compile-time type safety
- Check response structure consistency

### 3. Error Handling Tests
- Test graceful failure with invalid inputs using `Effect.exit` pattern
- Validate timeout behavior with fast-fail client configuration
- Check retry mechanisms and graceful degradation

**Error Handling Pattern:**
```typescript
const result = yield* Effect.exit(
  Effect.tryPromise(() => client.someFailingMethod())
)

if (Exit.isSuccess(result)) {
  expect(result.value).toBeDefined()
} else {
  expect(Exit.isFailure(result)).toBe(true)
}
```

### Known Test Data
- User ID: `"16085"` (for feed and user tests)
- Cast ID: `"0x4888649440c8cfd3ef6e28f2096a201d20253176"` (for post tests)
- Feed ID: `"feed_390"` (for feed configuration tests)

### Dynamic Test Data
- Timestamps: `Math.floor(Date.now() / 1000)`
- Unique names: `Test Feed ${Date.now()}`
- ISO dates: `new Date().toISOString()`

## Running Tests

### Prerequisites
```bash
export API_KEY_EMBED="your_api_key_here"
```

### Commands
```bash
# Run all tests
bun test

# Run specific test file
bun test feed.test.ts

# Run with verbose output
bun test --verbose
```

## Test Validation Checklist

Each test validates:
- ✅ Response is defined and not null
- ✅ Response structure matches expected format
- ✅ Array responses have correct length constraints
- ✅ Required properties exist and have correct types
- ✅ Scores are within expected ranges (0-1 for most, ≥0 for search)
- ✅ Error cases fail gracefully

## Important Notes

- **API Key Required**: Tests skip without `API_KEY_EMBED` environment variable
- **Rate Limiting**: Use fast-fail client for error handling tests to avoid timeouts
- **Effect Pattern**: All async operations use `Effect.tryPromise()` for proper error handling
- **Type Safety**: Always include explicit type validation tests alongside functional tests
- **Namespace Imports**: Use `import * as Effect from "effect/Effect"` for tree shaking
- **@effect/vitest Reference**: See `/agents/effect-vitest.md` for complete Effect testing patterns and advanced features

## @effect/vitest Integration

This test suite leverages `@effect/vitest` which provides:
- **Automatic TestContext**: `it.effect` provides TestContext with TestClock and other testing utilities
- **Effect Execution**: Seamless integration between Effect programs and Vitest assertions
- **Skip/Only Support**: `it.effect.skip` and `it.effect.only` for test selection
- **Error Handling**: Built-in support for Effect failure modes with `Effect.exit`
- **Resource Management**: `it.scoped` available for tests requiring Scope (not currently used)

For detailed examples and advanced patterns, consult `/agents/effect-vitest.md`.
