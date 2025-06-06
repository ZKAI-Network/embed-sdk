// Import generic HTTP methods
import { get, post } from "./common/http.js"

// Import auto-generated comprehensive API registry
import { PublicApi, type PublicApiType } from "./api-registry.js"

// Import additional SDK functions
import * as ApiFunctions from "./functions/index.js"

/**
 * Enhanced Embed API Client
 *
 * Provides comprehensive API access:
 * 🎯 Organized Functions - Opinionated defaults, prevents common errors
 * ⚡ Generated Functions - Direct schema-based functions for advanced use
 */
export const EmbedApi = {
  // All SDK functions
  ...ApiFunctions,

  // All API functions
  ...PublicApi,

  // HTTP methods for custom endpoints
  post,
  get
}

// Type exports for TypeScript users
export type { PublicApiType }
