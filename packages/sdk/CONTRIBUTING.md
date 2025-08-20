# CONTRIBUTING

SDK package for Embed AI APIs with Effect-based HTTP client and namespaced endpoints.

## Architecture Overview

```
mbdClient → HttpClient → Effect-based requests
├── feed/          - Feed management and personalized feeds
├── search/        - User and post search functionality
├── .../           - ... any other namespaces you'd add
├── interfaces/    - HTTP client interface definitions
└── client.ts      - Core HTTP client with retries/error handling
```

## What are you doing?

### Adding new API endpoint
- API definition → `packages/types/src/types/`
- Endpoint implementation → `src/[namespace]/` 
- Method binding → `src/[namespace]/namespace.ts`
- Integration test → `test/[namespace].test.ts`

### Core HTTP functionality
- Error handling → `src/client.ts` (NetworkError, HttpRequestError, ParseError, TimeoutError)
- Retry logic → `src/client.ts` (exponential backoff, configurable schedules)
- Request methods → HttpClient class methods

### Testing changes
- Unit logic → Effect-based test in `test/`
- Integration testing → Requires `API_KEY_EMBED` environment variable
- Type validation → Compile-time checks in test assertions

## Development Workflow

### 1. Endpoint Implementation
```bash
# Edit namespace file
vim src/[feed|search]/[specific-file].ts

# Add to namespace
vim src/[feed|search]/namespace.ts

# Update types if needed
cd ../types && vim src/types/[endpoint-types].ts
```

### 2. Testing
```bash
# Integration tests (requires API key)
export API_KEY_EMBED="your-key"
bun run test:integration

# Specific namespace
bun run test:[posts|users|feed]

# Type checking
bun run check
```

### 3. Build Validation
```bash
# Multi-format build (ESM + CJS)
bun run build

# Verify output
ls dist/
```

## Code Standards

### Effect Patterns
```typescript
// ✅ Namespace imports (tree-shakeable)
import * as Effect from "effect/Effect"
import * as Data from "effect/Data"

// ❌ Named imports (bundling issues)
import { Effect, Data } from "effect"
```

### Error Handling
```typescript
// ✅ Tagged errors with Effect
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

// HTTP client returns Effect<TResponse, HttpClientError>
```

### Client Structure
```typescript
// ✅ Namespace organization
class mbdClient {
  public readonly feed: FeedNamespace
  public readonly search: SearchNamespace
}
```

## Quality Gates

### Required Validations
```bash
# TypeScript compilation
bun run check

# Integration tests  
bun run test:integration

# Build verification
bun run build
```

### Pre-submission Checklist
- [ ] Effect namespace imports used
- [ ] Integration tests pass with API key
- [ ] TypeScript compilation succeeds
- [ ] Error handling follows tagged error pattern
- [ ] Multi-format build succeeds

## Dependencies

- **Peer**: effect >=3.0.0
- **Internal**: @embed-ai/types (workspace dependency)
- **Dev**: @effect/vitest, vitest

Changes to peer dependencies require version compatibility verification across all consuming packages.
