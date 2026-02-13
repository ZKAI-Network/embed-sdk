import { pipe, Schema as S } from "effect"

export const ForYouRequest = S.Struct({
  /**
   * Fid of user to get recommendations for. NOTE: wallet_address is ignored if user_id is
   * specified. At least one of user_id and wallet_address should be provided.
   */
  user_id: S.optional(S.String),
  /**
   * Wallet address (verified on Farcaster) of user to get recommendations for. NOTE: wallet_address
   * is ignored if user_id is specified. At least one of user_id and wallet_address should be
   * provided.
   */
  wallet_address: S.optional(S.String),
  /**
   * Feed configuration ID to use for generating recommendations. Note: The feed_id must be
   * accessible by your API key. If you receive an 'Invalid feed_id for this API' error, the feed_id
   * either doesn't exist or your API key doesn't have access to it.
   */
  feed_id: S.String,
  /** Maximum number of posts to return (max 500) */
  top_k: S.optional(pipe(S.Number, S.int())),
  /**
   * Number of posts that will be considered as seen by the user in a given API call, outside of any
   * potential offchain data
   */
  impression_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /**
   * Whether to include metadata (including AI labels and data to help rendering the posts) in
   * results
   */
  return_metadata: S.optionalWith(S.Boolean, {
    default: () => false
  }),
  /**
   * The feed_refresh parameter is a boolean flag in the For You API that controls whether API calls
   * trigger asynchronous background cache updates.
   *
   * _How It Works_*
   *
   * Default: true (maintains backward compatibility)
   *
   * _Behavior_*
   *
   * When feed_refresh = true (default):
   *
   * - Returns current cached feed recommendations
   * - Triggers background cache update via Kinesis or Lambda async invocation
   * - Update refreshes personalized recommendations with fresh engagement data, affinity scores, and
   *   new content
   *
   * When feed_refresh = false:
   *
   * - Returns current cached feed recommendations
   * - Skips background cache update entirely
   * - Logs: "feed_refresh=False, skipping cache updates"
   *
   * _Use Cases_*
   *
   * - Polling/prefetch requests: Set to false to reduce backend load
   * - High-frequency API calls: Set to false to prevent unnecessary processing
   * - Testing: Set to false for predictable responses
   * - Normal browsing: Use default true to keep recommendations fresh
   */
  feed_refresh: S.optionalWith(S.Boolean, {
    default: () => true
  })
})
export type ForYouRequest = S.Schema.Type<typeof ForYouRequest>
export const ForYouRequestEncoded = S.encodedSchema(ForYouRequest)
export type ForYouRequestEncoded = S.Schema.Encoded<typeof ForYouRequest>
