import { Schema as S } from "effect"

/**
 * A feed can "run out of items" when a user has seen all items satisfying the feed configuration
 * options. Fallback feeds specifies alternative feeds to show the user when the main feed runs out.
 * A maximum of 3 fallback feeds can be specified, and they will be used in the order specified,
 * when the previous active feed is completely consumed.
 */
export const FallbackFeedsParam = S.Array(
  S.Struct({
    /** The ID of the feed to be used as fallback */
    feed_id: S.optional(S.String)
  })
)
export type FallbackFeedsParam = S.Schema.Type<typeof FallbackFeedsParam>
export const FallbackFeedsParamEncoded = S.encodedSchema(FallbackFeedsParam)
export type FallbackFeedsParamEncoded = S.Schema.Encoded<typeof FallbackFeedsParam>
