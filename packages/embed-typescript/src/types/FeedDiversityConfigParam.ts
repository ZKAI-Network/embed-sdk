import { pipe, Schema as S } from "effect"

/**
 * Configurations that help improve the perceived diversity of the feed. Post are returned in order
 * of relevancy to the user based on the scoring algorithm, and thus it is possible that multiple
 * posts from the same user are returned in the same feed. Use these configurations to control how
 * the API should handle multiple posts from the same author
 */
export const FeedDiversityConfigParam = S.Struct({
  /** The maximum number of post from the same author the API is allowed to return */
  max_posts_per_author: S.optional(pipe(S.Number, S.int())),
  /**
   * The minimum distance between posts from teh same author in the feed. For example, if this is
   * set to 5, then 2 posts from the same author must be separated by at least 5 posts in between
   */
  min_distance_between_posts_from_same_author: S.optional(pipe(S.Number, S.int()))
})
export type FeedDiversityConfigParam = S.Schema.Type<typeof FeedDiversityConfigParam>
export const FeedDiversityConfigParamEncoded = S.encodedSchema(FeedDiversityConfigParam)
export type FeedDiversityConfigParamEncoded = S.Schema.Encoded<typeof FeedDiversityConfigParam>
