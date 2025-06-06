/**
 * Feed Functions
 *
 * Opinionated feed functions with:
 * - Required parameters enforced at compile time
 * - Sensible defaults for common use cases
 * - Clear naming that prevents mistakes
 */

import type { ForYou as ForYouType } from "../../types/ForYou.js"
import type { popular as PopularType } from "../../types/popular.js"
import type { trendingNow as TrendingType } from "../../types/trendingNow.js"
import { CoreApi } from "../api-registry.js"

/**
 * Get personalized feed for a specific user ID
 *
 * ✅ Ensures user_id is provided
 * ✅ Sets sensible defaults (top_k: 25, metadata: true)
 * ✅ No runtime parameter errors
 *
 * @param userId - Farcaster user ID (fid)
 * @param options - Additional configuration options
 *
 * @example
 * ```typescript
 * // Simple usage
 * const feed = yield* getForYouByUserId("12345")
 *
 * // With advanced options
 * const feed = yield* getForYouByUserId("12345", {
 *   top_k: 50,
 *   filters: { start_timestamp: "days_ago:7" }
 * })
 * ```
 */
export const getForYouByUserId = (userId: string, options?: Partial<Omit<ForYouType, "user_id">>) =>
  CoreApi.ForYou({
    user_id: userId,
    top_k: 25,
    return_metadata: true,
    ...options
  })

/**
 * Get personalized feed for a specific wallet address
 *
 * ✅ Ensures wallet_address is provided
 * ✅ Prevents common wallet address format mistakes
 *
 * @param walletAddress - Verified Farcaster wallet address
 * @param options - Additional configuration options
 *
 * @example
 * ```typescript
 * // Simple usage
 * const feed = yield* getForYouByWallet("0x1234...")
 *
 * // With custom scoring
 * const feed = yield* getForYouByWallet("0x1234...", {
 *   scoring: "balanced_feed_v0.0.1",
 *   top_k: 40
 * })
 * ```
 */
export const getForYouByWallet = (walletAddress: string, options?: Partial<Omit<ForYouType, "wallet_address">>) =>
  CoreApi.ForYou({
    wallet_address: walletAddress,
    top_k: 25,
    return_metadata: true,
    ...options
  })

/**
 * Get trending content with smart defaults
 *
 * ✅ Optimized defaults for trending discovery
 * ✅ Returns metadata for rich UX
 *
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // Quick trending with defaults
 * const trending = yield* getTrendingNow()
 *
 * // Custom trending period
 * const trending = yield* getTrendingNow({
 *   top_k: 50,
 *   filters: { start_timestamp: "hours_ago:6" }
 * })
 * ```
 */
export const getTrendingNow = (options?: Partial<TrendingType>) =>
  CoreApi.Trending({
    top_k: 25,
    return_metadata: true,
    ...options
  })

/**
 * Get popular content with engagement focus
 *
 * ✅ Uses 1-day scoring by default (balanced recency/popularity)
 * ✅ Includes metadata for engagement metrics
 *
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // Quick popular with defaults
 * const popular = yield* getPopularNow()
 *
 * // With engagement filtering
 * const popular = yield* getPopularNow({
 *   filters: {
 *     engagement: { min_likes_count: 5 }
 *   }
 * })
 * ```
 */
export const getPopularNow = (options?: Partial<PopularType>) =>
  CoreApi.Popular({
    top_k: 25,
    return_metadata: true,
    scoring: "1day",
    ...options
  })

/**
 * Get personalized feed with content diversity controls
 *
 * ✅ Prevents author clustering (max 2 posts per author)
 * ✅ Ensures content variety with spacing rules
 * ✅ Optimized for discovery feeds
 *
 * @param userId - Farcaster user ID
 * @param options - Additional options
 *
 * @example
 * ```typescript
 * const diverseFeed = yield* getPersonalizedFeedWithDiversity("12345")
 *
 * // With custom filters
 * const diverseFeed = yield* getPersonalizedFeedWithDiversity("12345", {
 *   filters: { start_timestamp: "days_ago:7" }
 * })
 * ```
 */
export const getPersonalizedFeedWithDiversity = (
  userId: string,
  options?: Partial<Omit<ForYouType, "user_id" | "feed_diversity_config">>
) =>
  CoreApi.ForYou({
    user_id: userId,
    top_k: 30,
    return_metadata: true,
    feed_diversity_config: {
      max_posts_per_author: 2,
      min_distance_between_posts_from_same_author: 5
    },
    ...options
  })
