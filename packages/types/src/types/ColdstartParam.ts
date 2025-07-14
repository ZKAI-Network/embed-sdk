import * as S from "effect/Schema"

/**
 * This specifies a feed to be used when a user is under "cold start", meaning that the user is
 * either new to the system or haven't interacted with the system for a long time. When a user is in
 * "cold start", engagement based recommendations is less reliable, and it might be beneficial to
 * use a different feed configuration
 */
export const ColdstartParam = S.Struct({
  /** The ID of the feed to be used for cold start users */
  cold_start_feed: S.optional(S.String)
})
export type ColdstartParam = S.Schema.Type<typeof ColdstartParam>
export const ColdstartParamEncoded = S.encodedSchema(ColdstartParam)
export type ColdstartParamEncoded = S.Schema.Encoded<typeof ColdstartParam>
