import { pipe, Schema as S } from "effect"

import { FallbackFeedsParam } from "./FallbackFeedsParam.js"
import { FeedDiversityConfigParam } from "./FeedDiversityConfigParam.js"
import { FiltersParam } from "./FiltersParam.js"
import { PromotionFiltersParam } from "./PromotionFiltersParam.js"
import { ScoringParam } from "./ScoringParam.js"

export const ForYou = S.Struct({
  /**
   * Fid of user to get recommendations for
   *
   * NOTE:
   *
   * - Wallet_address is ignored if user_id is specified
   * - At least one of user_id and wallet_address is required
   */
  user_id: S.optional(S.String),
  /**
   * Wallet address (verified on Farcaster) of user to get recommendations for
   *
   * NOTE:
   *
   * - Wallet_address is ignored if user_id is specified
   * - At least one of user_id and wallet_address is required
   */
  wallet_address: S.optional(S.String),
  /**
   * If you have configured and saved a feed_id in console [Feed
   * Builder](https://console.mbd.xyz/feed-builder), you can pass a feed_id as a parameter here. A
   * feed ID represents a list of pre-configured parameters for calling this API. See our [guide on
   * feed_id](https://docs.mbd.xyz/docs/feed-builder-feed_id) for more information
   */
  feed_id: S.optional(S.String),
  /** Maximum number of casts to return (max 500) */
  top_k: S.optional(pipe(S.Number, S.int())),
  /**
   * The number of items returned from this API to be considered "seen" by the user (specified by
   * user_id or wallet_address). "Seen" items will not be returned in subsequent API calls for the
   * same user.
   *
   * NOTE: This parameter is to be used alongside top_k (ignored if top_k is not specified)
   */
  impression_count: S.optional(pipe(S.Number, S.int())),
  scoring: S.optional(ScoringParam),
  /**
   * Items the current user_id has already interacted with are removed from the feed by default. Set
   * this to true to keep them in the feed
   */
  show_interacted_items: S.optional(S.Boolean),
  /**
   * Whether or not to remove posts that are created by the current viewing user (set to true to
   * prevent a user from seeing his or or own post)
   */
  remove_user_posts_from_feed: S.optional(S.Boolean),
  /**
   * Whether or not limit the feed to only posts that people followed by the viewing user have
   * interacted with - this can help improve the overall perceived relevancy of the feed to the
   * user
   */
  return_only_posts_with_social_proof: S.optional(S.Boolean),
  feed_diversity_config: S.optional(FeedDiversityConfigParam),
  /**
   * Whether to include metadata (including AI labels and data to help rendering the casts) in
   * results
   */
  return_metadata: S.optional(S.Boolean),
  filters: S.optional(FiltersParam),
  promotion_filters: S.optional(PromotionFiltersParam),
  fallback_feeds: S.optional(FallbackFeedsParam)
}) // FORYOU
export type ForYou = S.Schema.Type<typeof ForYou>
export const ForYouEncoded = S.encodedSchema(ForYou)
export type ForYouEncoded = S.Schema.Encoded<typeof ForYou>
