/**
 * Search Functions
 *
 * Opinionated search functions with:
 * - AI labels enabled by default for richer results
 * - Optimized result counts for search UX
 * - Smart defaults for semantic search
 */

import type { SemanticSearch as SearchType } from "../../types/SemanticSearch.js"
import { PublicApi } from "../api-registry.js"

/**
 * AI-powered semantic search with smart defaults
 *
 * ✅ Enables AI labels by default for richer results
 * ✅ Returns metadata for search relevance
 * ✅ Optimized result count for search UX
 *
 * @param query - Search query
 * @param options - Additional search options
 *
 * @example
 * ```typescript
 * // Quick search with defaults
 * const results = yield* searchWithAI("blockchain technology")
 *
 * // Advanced search with filters
 * const results = yield* searchWithAI("DeFi protocols", {
 *   top_k: 30,
 *   filters: {
 *     start_timestamp: "days_ago:3",
 *     ai_labels: ["technology", "finance"]
 *   }
 * })
 * ```
 */
export const searchWithAI = (query: string, options?: Partial<Omit<SearchType, "query">>) =>
  PublicApi.Search({
    query,
    top_k: 20,
    return_ai_labels: true,
    return_metadata: true,
    ...options
  })

/**
 * Quick semantic search optimized for mobile/quick results
 *
 * ✅ Reduced result count for faster loading
 * ✅ Essential metadata only
 * ✅ Perfect for autocomplete or quick previews
 *
 * @param query - Search query
 * @param options - Additional search options
 *
 * @example
 * ```typescript
 * // Quick mobile search
 * const results = yield* quickSearch("crypto")
 *
 * // With basic filtering
 * const results = yield* quickSearch("NFTs", {
 *   filters: { start_timestamp: "hours_ago:24" }
 * })
 * ```
 */
export const quickSearch = (query: string, options?: Partial<Omit<SearchType, "query">>) =>
  PublicApi.Search({
    query,
    top_k: 10,
    return_ai_labels: false,
    return_metadata: false,
    ...options
  })

/**
 * Deep semantic search with comprehensive results
 *
 * ✅ Maximum result count for comprehensive discovery
 * ✅ Full AI labels and metadata
 * ✅ Perfect for research or detailed exploration
 *
 * @param query - Search query
 * @param options - Additional search options
 *
 * @example
 * ```typescript
 * // Comprehensive search
 * const results = yield* deepSearch("web3 development trends")
 *
 * // With advanced filters
 * const results = yield* deepSearch("DeFi innovation", {
 *   filters: {
 *     start_timestamp: "days_ago:7",
 *     languages: ["en"],
 *     embed_domains: ["mirror.xyz", "paragraph.xyz"]
 *   }
 * })
 * ```
 */
export const deepSearch = (query: string, options?: Partial<Omit<SearchType, "query">>) =>
  PublicApi.Search({
    query,
    top_k: 50,
    return_ai_labels: true,
    return_metadata: true,
    ...options
  })
