import { pipe } from "effect"
import * as S from "effect/Schema"

import { AILabelsFilterParam } from "./AILabelsFilterParam.js"

/** Filtering options to be applied to the feed */
export const FiltersParam = S.Struct({
  /**
   * Return only casts after this start_timestamp, specified as either an Epoch timestamp (Unix
   * timestamp), or a relative time syntax specifying either a number of days ago or a number of
   * hours ago (see example)
   *
   * Examples:
   *
   * - "1577836800"
   * - "days_ago:7"
   * - "hours_ago:12"
   */
  start_timestamp: S.optional(S.String),
  /**
   * Return only casts before this end_timestamp, specified as either an Epoch timestamp (Unix
   * timestamp), or a relative time syntax specifying either a number of days ago or a number of
   * hours ago (see example)
   *
   * Examples:
   *
   * - "1577836800"
   * - "days_ago:7"
   * - "hours_ago:12"
   */
  end_timestamp: S.optional(S.String),
  /** Return only casts that were created from these source apps (specified as the app's signer FID) */
  app_fids: S.optional(S.Array(S.String)),
  /**
   * Return only casts that were created from these geo-locations, specified as strings of latitude
   * longitude pairs, to 2 decimal places, as specified in Farcaster
   *
   * Examples:
   *
   * - "48.86,2.35"
   * - "51.51,-0.13"
   * - "34.05,-118.24"
   *
   * NOTE: remove_geo_locations is ignored if geo_locations is defined
   */
  geo_locations: S.optional(S.Array(S.String)),
  /**
   * Do not return casts created from these geo-locations, specified as strings of latitude
   * longitude pairs, to 2 decimal places, as specified in Farcaster
   *
   * Examples:
   *
   * - "48.86,2.35"
   * - "51.51,-0.13"
   * - "34.05,-118.24"
   *
   * NOTE: this is ignored if geo_locations is defined
   */
  remove_geo_locations: S.optional(S.Array(S.String)),
  /** Return only casts that belong to these channels, specified by channel urls (root_parent_url) */
  channels: S.optional(S.Array(S.String)),
  /** Return only casts that use these languages */
  languages: S.optional(S.Array(S.String)),
  /** Return only casts created by authors with these fid's */
  author_ids: S.optional(S.Array(S.String)),
  /**
   * Do not return casts created by authors with these fid's
   *
   * NOTE: this is ignored if author_ids is defined
   */
  remove_author_ids: S.optional(S.Array(S.String)),
  /**
   * Return only casts with these publication types Available values:
   *
   * - `image`
   * - `video`
   * - `audio`
   */
  publication_types: S.optional(S.Array(S.String)),
  /** Return only casts with specific domains embedded */
  embed_domains: S.optional(S.Array(S.String)),
  ai_labels: S.optional(AILabelsFilterParam),
  /** Do not return casts with these AI labels */
  remove_ai_labels: S.optional(S.Array(S.String)),
  /**
   * Filter posts by specifying minimum or maximum engagement counts - this is useful for serving
   * posts that are already engaging (having minimum engagement) or surfacing posts that have not
   * been engaged yet (having 0 or small maximum engagement count)
   */
  engagement: S.optional(
    S.Struct({
      /** The miniumum number of likes the post must have received */
      min_likes_count: S.optional(pipe(S.Number, S.int())),
      /** The maximum number of likes the post have received */
      max_likes_count: S.optional(pipe(S.Number, S.int())),
      /** The minimum number of times the post have been shared */
      min_shares_count: S.optional(pipe(S.Number, S.int())),
      /** The maximum number of times the post have been shared */
      max_shares_count: S.optional(pipe(S.Number, S.int())),
      /** The minimum number of comments left on the post */
      min_comments_count: S.optional(pipe(S.Number, S.int())),
      /** The maximum number of comments left on the post */
      max_comments_count: S.optional(pipe(S.Number, S.int()))
    })
  )
})
export type FiltersParam = S.Schema.Type<typeof FiltersParam>
export const FiltersParamEncoded = S.encodedSchema(FiltersParam)
export type FiltersParamEncoded = S.Schema.Encoded<typeof FiltersParam>
