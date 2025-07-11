import { Schema as S } from "effect"

/**
 * The type of algorithm to use for ranking - ie how to personalize the feed for the current user_id
 * and decide what to show the user first
 *
 * In the following description:
 *
 * - User interest is inferred from the user's past interaction with different types of content
 * - Affinity is based on the user's following graph
 *
 * Available values:
 *
 * - `balanced_feed_v0.0.1` - balanced mix of interest and affinity based scoring (this is the
 *   default)
 * - `balanced_feed_interest_bias_v0.0.1` - balanced mix of interest and affinity based scoring, with
 *   a bias towards interest-based scoring
 * - `balanced_feed_affinity_bias_v0.0.1` - balanced mix of interest and affinity based scoring, with
 *   a bias towards affinity-based scoring
 * - `user_affinity_all_following_v0.0.1` - recommend items for user based on all of the user's
 *   followings
 * - `user_affinity_closest_following_v0.0.1` - recommend items for user based on their followings,
 *   with "closer" users (more frequent interaction) ranked higher
 * - `user_interest_all_v0.0.1` - recommend items for user based on user interests, inferred from all
 *   past interactions
 * - `user_interest_recent_v0.0.1` - recommend items for user based on user interests, inferred from
 *   past interactions with a recency bias
 */
export const ScoringParam = S.Literal(
  "balanced_feed_v0.0.1",
  "balanced_feed_interest_bias_v0.0.1",
  "balanced_feed_affinity_bias_v0.0.1",
  "user_affinity_all_following_v0.0.1",
  "user_affinity_closest_following_v0.0.1",
  "user_interest_all_v0.0.1",
  "user_interest_recent_v0.0.1"
)
export type ScoringParam = S.Schema.Type<typeof ScoringParam>
export const ScoringParamEncoded = S.encodedSchema(ScoringParam)
export type ScoringParamEncoded = S.Schema.Encoded<typeof ScoringParam>
