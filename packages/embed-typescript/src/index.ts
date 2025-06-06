/**
 * Enhanced Embed TypeScript SDK
 *
 * This SDK provides both Effect-based and Promise-based APIs for the mbd.xyz embed service.
 * All core functions are auto-generated from schemas for consistency and type safety.
 */

// Export the main API with auto-generated functions and convenience methods
export * from "./api/index.js"

// Export client implementations
export * from "./client-effect.js"
export * from "./client.js"

// Export HTTP utilities
export * as http from "./api/common/http.js"

// Export all type schemas for advanced usage
export * as AILabelsFilterParam from "./types/AILabelsFilterParam.js"
export * as ColdstartParam from "./types/ColdstartParam.js"
export * as Empty from "./types/Empty.js"
export * as FallbackFeedsParam from "./types/FallbackFeedsParam.js"
export * as FeedDiversityConfigParam from "./types/FeedDiversityConfigParam.js"
export * as FiltersParam from "./types/FiltersParam.js"
export * as ForYou from "./types/ForYou.js"
export * as ForYouReranked from "./types/ForYouReranked.js"
export * as LabelsForItems from "./types/LabelsForItems.js"
export * as LabelsForText from "./types/LabelsForText.js"
export * as LabelsForUsers from "./types/LabelsForUsers.js"
export * as LabelsTopItems from "./types/LabelsTopItems.js"
export * as LabelsTopUsers from "./types/LabelsTopUsers.js"
export * as PopularType from "./types/popular.js"
export * as PromotionFiltersParam from "./types/PromotionFiltersParam.js"
export * as ScoringParam from "./types/ScoringParam.js"
export * as SemanticSearch from "./types/SemanticSearch.js"
export * as Similar from "./types/Similar.js"
export * as TopicParam from "./types/TopicParam.js"
export * as trendingNow from "./types/trendingNow.js"
export * as UsersFeedForChannel from "./types/UsersFeedForChannel.js"
export * as UsersFeedForItem from "./types/UsersFeedForItem.js"
export * as UsersFeedForTopic from "./types/UsersFeedForTopic.js"
export * as UsersFeedSimilar from "./types/UsersFeedSimilar.js"
export * as UsersSemanticSearch from "./types/UsersSemanticSearch.js"
