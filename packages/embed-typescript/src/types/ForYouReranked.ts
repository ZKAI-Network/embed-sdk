import { Schema as S } from "effect"

import { FiltersParam } from "./FiltersParam.js"

export const ForYouReranked = S.Struct({
  /** Fid of user to rerank the cast list for */
  user_id: S.String,
  /**
   * Cast list to be reranked for user (specified in the `user_id` parameter)
   *
   * The maximum number of items in `items_list` is 500
   */
  items_list: S.Array(S.String),
  /**
   * The type of interaction the recommendation scoring should be based on
   *
   * Available values:
   *
   * - `all`
   */
  scoring: S.optional(S.String),
  /** Whether to include metadata (embed items, processed text, author fid) in results */
  return_metadata: S.optional(S.Boolean),
  filters: S.optional(FiltersParam)
}) // ForYouReranked
export type ForYouReranked = S.Schema.Type<typeof ForYouReranked>
export const ForYouRerankedEncoded = S.encodedSchema(ForYouReranked)
export type ForYouRerankedEncoded = S.Schema.Encoded<typeof ForYouReranked>
