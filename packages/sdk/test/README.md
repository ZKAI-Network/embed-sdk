# SDK Test Harness

A comprehensive test suite for the Embed AI SDK that validates endpoint functionality and type safety across all namespaces.

## Overview

This test harness provides regression testing for the SDK to catch issues before release. It validates:

- ✅ **Endpoint Calls**: All API endpoints respond without error
- ✅ **Type Safety**: Return types match TypeScript definitions  
- ✅ **Response Structure**: API responses have correct structure
- ✅ **Error Handling**: Graceful handling of invalid inputs
- ✅ **Feature Coverage**: All major SDK functionality is tested

## Setup

### Prerequisites
1. **API Key**: Set your Embed AI API key in environment variables:
   ```bash
   export API_KEY_EMBED="your-api-key-here"
   ```

2. **Dependencies**: Install test dependencies:
   ```bash
   bun install
   ```

### Environment Configuration

The test suite automatically detects your API key and will:
- ✅ **Run integration tests** if API key is found
- ⏭️  **Skip tests gracefully** if no API key is provided

## Running Tests

### All Tests
```bash
# Run all tests once
bun run test:integration

# Run tests in watch mode
bun run test:watch

# Run with UI (if @vitest/ui is installed)
bun run test:ui
```

### Individual Namespaces
```bash
# Test search.posts namespace only
bun run test:posts

# Test search.users namespace only  
bun run test:users

# Test feed namespace only
bun run test:feed
```

### Coverage & Reporting
```bash
# Generate coverage report
bun run coverage

# Verbose integration test run
bun run test:integration
```

## Test Architecture

### Effect-Based Testing
Tests use `@effect/vitest` for Effect-native testing:

```typescript
import { it, expect } from "@effect/vitest"
import { Effect } from "effect"

testCondition("api call test", () =>
  Effect.gen(function* () {
    const result = yield* Effect.tryPromise(() =>
      client.search.posts.byQuery("test query")
    )
    expect(result).toBeDefined()
  })
)
```

### Conditional Testing
Tests automatically skip if no API key is provided:

```typescript
const testCondition = apiKey ? it.effect : it.effect.skip
```

### Type Validation
Tests include compile-time type checking:

```typescript
// This will fail at compile time if types don't match
const typedResult: PostSemanticSearchResponse = result
expect(typedResult).toBeDefined()
```

## What Gets Tested

### ✅ Successful Operations
- API calls with valid parameters
- Response structure validation
- Type safety verification
- Metadata presence (when applicable)

### ⚠️ Error Handling  
- Invalid parameters (empty queries, malformed IDs)
- Non-existent resources
- Graceful failure modes
- Proper error responses

### 🏗️ Data Validation
- Array structures and lengths
- Required vs optional fields
- Score ranges (0-1 for relevance scores)
- String vs number type validation

## CI/CD Integration

This test suite is designed for continuous integration:

```yaml
# Example GitHub Action
- name: Run SDK Tests
  run: |
    cd packages/sdk
    bun run test:integration
  env:
    API_KEY_EMBED: ${{ secrets.API_KEY_EMBED }}
```

## Contributing

When adding new SDK functionality:

1. **Add tests** for new endpoints/methods
2. **Validate types** in test assertions  
3. **Test error cases** for robustness
4. **Update this README** if adding new test/namespaces

The test harness helps maintain SDK quality and prevents regressions across releases. 
