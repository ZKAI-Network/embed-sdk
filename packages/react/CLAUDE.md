# React Package Optimization Rules

## 1. Bundle Size Optimization

### Use Subpath Exports
- **NEVER** use barrel exports (`export * from`) in main index files
- **ALWAYS** organize components into logical groups with subpath exports
- **PREFER** importing from specific paths for better tree-shaking:
  ```typescript
  // ✅ Good - tree-shakeable
  import { Button } from "@embed-ai/react/ui"
  import { FeedCard } from "@embed-ai/react/feed"
  
  // ❌ Bad - imports everything
  import { Button, FeedCard } from "@embed-ai/react"
  ```

### Package.json Requirements
- **MUST** set `"sideEffects": false` for tree-shaking
- **MUST** use `exports` field with subpath exports
- **MUST** include `files` field to control what gets published
- **MUST** point `main` and `types` to `dist/` directory

## 2. Component Organization

### Group by Functionality
- **ui/**: Core UI components (Button, Card, Avatar, etc.)
- **feed/**: Feed-related components (FeedCard, FeedGrid, etc.)
- **media/**: Media components (VideoPlayer, ImageGallery, etc.)
- **utils/**: Utility functions

### File Structure
```
src/
├── components/        # Individual component files
├── ui/index.ts       # Core UI exports
├── feed/index.ts     # Feed component exports
├── media/index.ts    # Media component exports
├── lib/utils.ts      # Utilities
└── index.ts          # Main entry (re-exports all)
```

## 3. Dependency Management

### Minimize Dependencies
- **AVOID** duplicate icon libraries 
- **AVOID** unnecessary libraries, keep it simple
- **CONSIDER** making heavy dependencies peer dependencies

### Import Strategy
- **USE** namespace imports for better tree-shaking:
  ```typescript
  // ✅ Good
  import * as React from "react"
  
  // ❌ Bad
  import { useState, useEffect } from "react"
  ```

## 4. Build Configuration

### TypeScript Configuration
- **MUST** compile to `dist/` directory
- **MUST** generate `.d.ts` files for TypeScript support
- **MUST** exclude test files from builds

### Build Pipeline
- **MUST** make it clear how to consume and check support is there for React to be used in NextJS, Preact, Vite + React and other builds
- **MUST** use pure call annotations for better bundling
- **MUST** exclude source maps from published package

## 5. Performance Guidelines

### Component Design
- **PREFER** small, focused components over large ones
- **USE** React.memo for expensive re-renders
- **AVOID** inline object/function creation in render

### Import Optimization
- **ALWAYS** use specific imports rather than entire libraries
- **PREFER** importing only what's needed from UI libraries
- **AVOID** importing entire icon sets

## 6. Publishing Rules

### Package Metadata
- **MUST** have proper `repository` field
- **MUST** use `publishConfig.access: "public"`
- **MUST** publish from `dist/` directory

### Quality Checks
- **MUST** run TypeScript checks before publishing
- **MUST** ensure no build errors
- **MUST** verify tree-shaking works correctly


# 7. Migration Notes

When updating this package:
1. **CHECK** that subpath exports work correctly
2. **VERIFY** tree-shaking is working (test with bundler)
3. **ENSURE** TypeScript types are properly exported
4. **VALIDATE** that common use cases work

Following these rules ensures the React package remains client-friendly with minimal bundle impact.
