/**
 * User Functions
 *
 * Opinionated user functions with:
 * - Smart defaults for user discovery
 * - Optimized parameters for common use cases
 * - Easy-to-use user feed functions
 */

import type { UsersFeedForChannel as UsersFeedForChannelType } from "../../types/UsersFeedForChannel.js"
import type { UsersSemanticSearch as UsersSearchType } from "../../types/UsersSemanticSearch.js"
import { PublicApi } from "../api-registry.js"

/**
 * Discover users with AI-powered semantic search
 *
 * ✅ Optimized for user discovery
 * ✅ Smart result count for browsing
 * ✅ Perfect for finding interesting accounts
 *
 * @param query - User search query (interests, bio keywords, etc.)
 * @param options - Additional search options
 *
 * @example
 * ```typescript
 * // Find crypto developers
 * const users = yield* discoverUsers("crypto developers and builders")
 *
 * // Find users by interest with limits
 * const users = yield* discoverUsers("DeFi enthusiasts", {
 *   top_k: 20
 * })
 * ```
 */
export const discoverUsers = (query: string, options?: Partial<Omit<UsersSearchType, "query">>) =>
  PublicApi.UsersSearch({
    query,
    top_k: 15,
    ...options
  })

/**
 * Find users most active in a specific channel
 *
 * ✅ Shows most engaged users by default (likes)
 * ✅ Perfect for finding channel influencers
 * ✅ Returns users based on activity type
 *
 * @param channel - Channel identifier
 * @param options - Additional options
 *
 * @example
 * ```typescript
 * // Find top contributors in a channel
 * const activeUsers = yield* getChannelActiveUsers("chain://eip155:1/erc721:0x123abc")
 *
 * // Find users who share content in channel
 * const shareUsers = yield* getChannelActiveUsers("farcaster", {
 *   event_type: "share"
 * })
 * ```
 */
export const getChannelActiveUsers = (
  channel: string,
  options?: Partial<Omit<UsersFeedForChannelType, "channel">>
) =>
  PublicApi.UsersFeedByChannel({
    channel,
    event_type: "like",
    ...options
  })

/**
 * Quick user search for autocomplete/suggestions
 *
 * ✅ Fast, lightweight search
 * ✅ Reduced result count for quick UX
 * ✅ Perfect for typeahead/autocomplete
 *
 * @param query - Quick search query
 * @param options - Additional options
 *
 * @example
 * ```typescript
 * // Quick search for autocomplete
 * const suggestions = yield* quickUserSearch("vitalik")
 * ```
 */
export const quickUserSearch = (query: string, options?: Partial<Omit<UsersSearchType, "query">>) =>
  PublicApi.UsersSearch({
    query,
    top_k: 5,
    ...options
  })

/**
 * Find power users (highly followed/engaged users)
 *
 * ✅ Searches for influential accounts
 * ✅ Good for finding thought leaders
 * ✅ Combines search with influence signals
 *
 * @param topic - Topic area for power users
 * @param options - Additional options
 *
 * @example
 * ```typescript
 * // Find crypto thought leaders
 * const powerUsers = yield* findPowerUsers("crypto thought leaders and analysts")
 *
 * // Find DeFi influencers
 * const defiInfluencers = yield* findPowerUsers("DeFi protocol founders", {
 *   top_k: 25
 * })
 * ```
 */
export const findPowerUsers = (topic: string, options?: Partial<Omit<UsersSearchType, "query">>) =>
  PublicApi.UsersSearch({
    query: `${topic} influential accounts high followers engagement`,
    top_k: 10,
    ...options
  })
