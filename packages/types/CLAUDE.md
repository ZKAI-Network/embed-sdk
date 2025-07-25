# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- `bun run build` - Build TypeScript types
- `bun run check` - Type check
- `bun run test` - Run tests using Vitest
- `bun run oas-types` - Generate types from OpenAPI spec using `bunx openapi-to-effect gen src/types/api-spec/embed-farcaster-api-oas.json src/types/`

### Package Information
- This is the `@embed-ai/types` package, part of the larger embed-sdk monorepo
- Uses TypeScript project references with composite builds
- Built for ES modules (`"type": "module"` in package.json)

## Architecture

### Core Structure
This is a TypeScript types package that provides comprehensive type definitions for Embed AI's Farcaster APIs. The package is organized around Effect Schema for runtime validation and type generation.

### Key Architectural Patterns

#### Effect Schema Integration
- All types are defined using Effect Schema (`effect/Schema`)
- Each schema exports both the schema itself and an `*Encoded` version for API serialization
- Runtime validation is available through Effect's decode/encode functions
- Example pattern:
  ```typescript
  export const ForYou = S.Struct({ ... })
  export type ForYou = S.Schema.Type<typeof ForYou>
  export const ForYouEncoded = S.encodedSchema(ForYou)
  export type ForYouEncoded = S.Schema.Encoded<typeof ForYou>
  ```

#### Modular Export Structure
The package provides both flat exports (all types from root) and organized subpath exports:
- Root: All types and schemas from `src/index.ts`
- `feeds/`: Feed-related types (`ForYou`, `ForYouReranked`, `popular`, `trendingNow`)
- `labels/`: AI labeling types (`LabelsForItems`, `LabelsForText`, `LabelsForUsers`)
- `search/`: Search and filtering types (`SemanticSearch`, `Similar`, `TopicParam`)
- `users/`: User feed types (`UsersFeedForChannel`, `UsersFeedForItem`, etc.)
- `responses/`: Response types (re-exports from `types-return/`)

#### Type Organization
- **Request Types**: Located in `src/types/` - parameter schemas for API requests
- **Response Types**: Located in `src/types-return/` - response schemas from APIs
- **Category Exports**: Located in `src/{category}/index.ts` - organized re-exports

### OpenAPI Integration
- OpenAPI specification stored in `src/types/api-spec/embed-farcaster-api-oas.json`
- Types can be regenerated from the spec using the `oas-types` script
- Uses `openapi-to-effect` for generating Effect Schema types from OpenAPI specs

### Dependencies
- **Effect**: Peer dependency for schema definition and runtime validation
- **TypeScript**: Development dependency for compilation
- No other runtime dependencies - this is a pure types package

### Build System
- Uses TypeScript project references with composite builds
- `tsconfig.build.json` extends `tsconfig.src.json` with declaration generation
- Outputs to `dist/` directory with both `.js` and `.d.ts` files
- Package exports are configured for both types and imports in `package.json`
