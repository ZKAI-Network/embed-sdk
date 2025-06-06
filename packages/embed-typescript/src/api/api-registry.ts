/**
 * API Registry & Type-Safe Function Generator
 *
 * This is the central registry for all mbd.xyz API endpoints, providing:
 * - Complete endpoint definitions with schemas
 * - Auto-generated type-safe API functions
 * - Clear separation between internal/public APIs
 * - Logical categorization by functionality
 */

import { HttpClientRequest } from "@effect/platform"
import { Effect, Schema as S } from "effect"
import { MbdHttpClient } from "../client-effect.js"

// Schema imports organized by category
import { ForYou as ForYouSchema } from "../types/ForYou.js"
import { ForYouReranked as ForYouRerankedSchema } from "../types/ForYouReranked.js"
import { popular as PopularSchema } from "../types/popular.js"
import { trendingNow as TrendingSchema } from "../types/trendingNow.js"

import { SemanticSearch as SearchSchema } from "../types/SemanticSearch.js"
import { Similar as SimilarSchema } from "../types/Similar.js"

import { UsersFeedForChannel as UsersFeedForChannelSchema } from "../types/UsersFeedForChannel.js"
import { UsersFeedForItem as UsersFeedForItemSchema } from "../types/UsersFeedForItem.js"
import { UsersFeedForTopic as UsersFeedForTopicSchema } from "../types/UsersFeedForTopic.js"
import { UsersFeedSimilar as UsersFeedSimilarSchema } from "../types/UsersFeedSimilar.js"
import { UsersSemanticSearch as UsersSemanticSearchSchema } from "../types/UsersSemanticSearch.js"

import { LabelsForItems as LabelsForItemsSchema } from "../types/LabelsForItems.js"
import { LabelsForText as LabelsForTextSchema } from "../types/LabelsForText.js"
import { LabelsForUsers as LabelsForUsersSchema } from "../types/LabelsForUsers.js"
import { LabelsTopItems as LabelsTopItemsSchema } from "../types/LabelsTopItems.js"
import { LabelsTopUsers as LabelsTopUsersSchema } from "../types/LabelsTopUsers.js"

/**
 * Configuration for a single API endpoint
 */
export interface EndpointConfig<T> {
  /** REST endpoint path */
  endpoint: string
  /** HTTP method */
  method: "GET" | "POST"
  /** Effect Schema for type validation */
  schema: S.Schema<T>
  /** Whether authentication is required */
  requiresAuth?: boolean
  /** Human-readable description */
  description: string
  /** Category for logical grouping */
  category: "feeds" | "search" | "users" | "ai_labels" | "similarity"
  /** Hide from public API (use convenience functions instead) */
  internal?: boolean
  /** Custom validation logic after schema validation */
  customValidation?: (params: T) => void
}

/**
 * Complete API endpoint registry
 * Organized by logical categories for better maintainability
 */
export const ENDPOINTS = {
  // =====================================================================
  // FEED ENDPOINTS - Content discovery and personalization
  // =====================================================================
  feeds: {
    forYou: {
      endpoint: "/v2/farcaster/casts/feed/for-you",
      method: "POST" as const,
      schema: ForYouSchema,
      requiresAuth: true,
      description: "Personalized feed recommendations",
      category: "feeds" as const,
      internal: true, // Use convenience functions instead
      customValidation: (params: any) => {
        if (!params.user_id && !params.wallet_address) {
          throw new Error("Either user_id or wallet_address is required")
        }
      }
    },
    forYouReranked: {
      endpoint: "/v2/farcaster/casts/feed/for-you-reranked",
      method: "POST" as const,
      schema: ForYouRerankedSchema,
      requiresAuth: true,
      description: "Advanced reranked personalized feed",
      category: "feeds" as const
    },
    popular: {
      endpoint: "/v2/farcaster/casts/feed/popular",
      method: "POST" as const,
      schema: PopularSchema,
      requiresAuth: false,
      description: "Popular content by engagement metrics",
      category: "feeds" as const
    },
    trending: {
      endpoint: "/v2/farcaster/casts/feed/trending",
      method: "POST" as const,
      schema: TrendingSchema,
      requiresAuth: false,
      description: "Real-time trending content",
      category: "feeds" as const
    }
  },

  // =====================================================================
  // SEARCH ENDPOINTS - Content and user discovery
  // =====================================================================
  search: {
    semantic: {
      endpoint: "/v2/farcaster/casts/search/semantic",
      method: "POST" as const,
      schema: SearchSchema,
      requiresAuth: false,
      description: "AI-powered semantic content search",
      category: "search" as const
    },
    users: {
      endpoint: "/v2/farcaster/users/search/semantic",
      method: "POST" as const,
      schema: UsersSemanticSearchSchema,
      requiresAuth: false,
      description: "AI-powered user discovery",
      category: "search" as const
    }
  },

  // =====================================================================
  // USER FEED ENDPOINTS - User-specific content streams
  // =====================================================================
  users: {
    feedByChannel: {
      endpoint: "/v2/farcaster/users/feed/for-channel",
      method: "POST" as const,
      schema: UsersFeedForChannelSchema,
      requiresAuth: false,
      description: "User activity feed for specific channel",
      category: "users" as const
    },
    feedByItem: {
      endpoint: "/v2/farcaster/users/feed/for-item",
      method: "POST" as const,
      schema: UsersFeedForItemSchema,
      requiresAuth: false,
      description: "User activity feed for specific item",
      category: "users" as const
    },
    feedByTopic: {
      endpoint: "/v2/farcaster/users/feed/for-topic",
      method: "POST" as const,
      schema: UsersFeedForTopicSchema,
      requiresAuth: false,
      description: "User activity feed by topic",
      category: "users" as const
    },
    similarFeed: {
      endpoint: "/v2/farcaster/users/feed/similar",
      method: "POST" as const,
      schema: UsersFeedSimilarSchema,
      requiresAuth: false,
      description: "Feed from users with similar interests",
      category: "users" as const
    }
  },

  // =====================================================================
  // AI LABELS ENDPOINTS - Content classification and analysis
  // =====================================================================
  aiLabels: {
    forItems: {
      endpoint: "/v2/farcaster/ai-labels/for-items",
      method: "POST" as const,
      schema: LabelsForItemsSchema,
      requiresAuth: false,
      description: "AI-generated labels for content items",
      category: "ai_labels" as const
    },
    forText: {
      endpoint: "/v2/farcaster/ai-labels/for-text",
      method: "POST" as const,
      schema: LabelsForTextSchema,
      requiresAuth: false,
      description: "AI-generated labels for text content",
      category: "ai_labels" as const
    },
    forUsers: {
      endpoint: "/v2/farcaster/ai-labels/for-users",
      method: "POST" as const,
      schema: LabelsForUsersSchema,
      requiresAuth: false,
      description: "AI-generated labels for users",
      category: "ai_labels" as const
    },
    topItems: {
      endpoint: "/v2/farcaster/ai-labels/top-items",
      method: "POST" as const,
      schema: LabelsTopItemsSchema,
      requiresAuth: false,
      description: "Top-performing items by AI label",
      category: "ai_labels" as const
    },
    topUsers: {
      endpoint: "/v2/farcaster/ai-labels/top-users",
      method: "POST" as const,
      schema: LabelsTopUsersSchema,
      requiresAuth: false,
      description: "Top users by AI label classification",
      category: "ai_labels" as const
    }
  },

  // =====================================================================
  // SIMILARITY ENDPOINTS - Content recommendation
  // =====================================================================
  similarity: {
    similar: {
      endpoint: "/v2/farcaster/casts/similar",
      method: "POST" as const,
      schema: SimilarSchema,
      requiresAuth: false,
      description: "Find content similar to given item",
      category: "similarity" as const
    }
  }
} as const

/**
 * Flattened registry for easier programmatic access
 * Maps simple names to endpoint configurations
 */
export const FLAT_REGISTRY = {
  // Feeds
  ForYou: ENDPOINTS.feeds.forYou,
  ForYouReranked: ENDPOINTS.feeds.forYouReranked,
  Popular: ENDPOINTS.feeds.popular,
  Trending: ENDPOINTS.feeds.trending,

  // Search
  Search: ENDPOINTS.search.semantic,
  UsersSearch: ENDPOINTS.search.users,

  // User Feeds
  UsersFeedByChannel: ENDPOINTS.users.feedByChannel,
  UsersFeedByItem: ENDPOINTS.users.feedByItem,
  UsersFeedByTopic: ENDPOINTS.users.feedByTopic,
  UsersSimilarFeed: ENDPOINTS.users.similarFeed,

  // AI Labels
  LabelsForItems: ENDPOINTS.aiLabels.forItems,
  LabelsForText: ENDPOINTS.aiLabels.forText,
  LabelsForUsers: ENDPOINTS.aiLabels.forUsers,
  LabelsTopItems: ENDPOINTS.aiLabels.topItems,
  LabelsTopUsers: ENDPOINTS.aiLabels.topUsers,

  // Similarity
  Similar: ENDPOINTS.similarity.similar
} as const

/**
 * Type-safe API function factory
 * Generates Effect-based functions with full validation
 */
export function createApiFunction<T>(config: EndpointConfig<T>) {
  return (params?: T) =>
    Effect.gen(function*() {
      const client = yield* MbdHttpClient

      if (params) {
        // Schema validation
        const validatedParams = yield* S.decodeUnknown(config.schema)(params)

        // Custom validation
        if (config.customValidation) {
          config.customValidation(validatedParams)
        }

        const request = config.method === "GET"
          ? HttpClientRequest.get(config.endpoint)
          : yield* HttpClientRequest.post(config.endpoint).pipe(
            HttpClientRequest.bodyJson(validatedParams)
          )

        const response = yield* client.execute(request)
        return yield* response.json
      } else {
        // No parameters
        const request = config.method === "GET"
          ? HttpClientRequest.get(config.endpoint)
          : HttpClientRequest.post(config.endpoint)

        const response = yield* client.execute(request)
        return yield* response.json
      }
    })
}

/**
 * Core API functions (includes internal functions)
 * These are the raw, auto-generated functions from the registry
 */
export const CoreApi = {
  // Feed functions
  ForYou: createApiFunction(FLAT_REGISTRY.ForYou),
  ForYouReranked: createApiFunction(FLAT_REGISTRY.ForYouReranked),
  Popular: createApiFunction(FLAT_REGISTRY.Popular),
  Trending: createApiFunction(FLAT_REGISTRY.Trending),

  // Search functions
  Search: createApiFunction(FLAT_REGISTRY.Search),
  UsersSearch: createApiFunction(FLAT_REGISTRY.UsersSearch),

  // User feed functions
  UsersFeedByChannel: createApiFunction(FLAT_REGISTRY.UsersFeedByChannel),
  UsersFeedByItem: createApiFunction(FLAT_REGISTRY.UsersFeedByItem),
  UsersFeedByTopic: createApiFunction(FLAT_REGISTRY.UsersFeedByTopic),
  UsersSimilarFeed: createApiFunction(FLAT_REGISTRY.UsersSimilarFeed),

  // AI Labels functions
  LabelsForItems: createApiFunction(FLAT_REGISTRY.LabelsForItems),
  LabelsForText: createApiFunction(FLAT_REGISTRY.LabelsForText),
  LabelsForUsers: createApiFunction(FLAT_REGISTRY.LabelsForUsers),
  LabelsTopItems: createApiFunction(FLAT_REGISTRY.LabelsTopItems),
  LabelsTopUsers: createApiFunction(FLAT_REGISTRY.LabelsTopUsers),

  // Similarity functions
  Similar: createApiFunction(FLAT_REGISTRY.Similar)
} as const

/**
 * Public API functions (excludes internal functions)
 * This is what is exposed to developers via the SDK
 */
export const PublicApi = {
  // Core feeds
  Popular: CoreApi.Popular,
  Trending: CoreApi.Trending,
  ForYouReranked: CoreApi.ForYouReranked,

  // Search
  Search: CoreApi.Search,
  UsersSearch: CoreApi.UsersSearch,

  // User feeds
  UsersFeedByChannel: CoreApi.UsersFeedByChannel,
  UsersFeedByItem: CoreApi.UsersFeedByItem,
  UsersFeedByTopic: CoreApi.UsersFeedByTopic,
  UsersSimilarFeed: CoreApi.UsersSimilarFeed,

  // AI Labels
  LabelsForItems: CoreApi.LabelsForItems,
  LabelsForText: CoreApi.LabelsForText,
  LabelsForUsers: CoreApi.LabelsForUsers,
  LabelsTopItems: CoreApi.LabelsTopItems,
  LabelsTopUsers: CoreApi.LabelsTopUsers,

  // Similarity
  Similar: CoreApi.Similar
} as const

/**
 * Registry metadata for tooling and documentation
 */
export const REGISTRY_META = {
  totalEndpoints: Object.keys(FLAT_REGISTRY).length,
  publicEndpoints: Object.keys(PublicApi).length,
  internalEndpoints: Object.values(FLAT_REGISTRY).filter((config) => (config as any).internal).length,

  categoryCounts: {
    feeds: Object.keys(ENDPOINTS.feeds).length,
    search: Object.keys(ENDPOINTS.search).length,
    users: Object.keys(ENDPOINTS.users).length,
    aiLabels: Object.keys(ENDPOINTS.aiLabels).length,
    similarity: Object.keys(ENDPOINTS.similarity).length
  },

  authRequiredEndpoints: Object.entries(FLAT_REGISTRY)
    .filter(([, config]) => config.requiresAuth)
    .map(([name]) => name),

  endpointsByCategory: {
    feeds: Object.keys(ENDPOINTS.feeds),
    search: Object.keys(ENDPOINTS.search),
    users: Object.keys(ENDPOINTS.users),
    aiLabels: Object.keys(ENDPOINTS.aiLabels),
    similarity: Object.keys(ENDPOINTS.similarity)
  }
} as const

// Type exports
export type PublicApiType = typeof PublicApi
