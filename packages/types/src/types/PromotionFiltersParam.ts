import { pipe, Schema as S } from "effect"

import { FiltersParam } from "./FiltersParam.js"

/**
 * Define another set of filters for promotional content that will be be inserted in the resulting
 * feed (currently limited to a maximum of 10 promotion filters)
 *
 * Two types of promotions are supported: 1) `feed` and 2) `items`. This is specified by the
 * `promotion_type` parameter.
 *
 * 1. `feed` promotion uses either the supplied filter or a `feed_id` to retrieve a "promotional" list
 *    of items to be inserted into the main feed. `percent` can be used to control the ratio of
 *    items from main feed and promotion feed
 * 2. `items` promotion lets you specify a list of specific items to be inserted at specific locations
 *    (`rank`) in the response
 */
export const PromotionFiltersParam = S.Array(
  S.Struct({
    /** Specifies the type of promotion Supported types: `feed` or `items` */
    promotion_type: S.optional(S.String),
    /**
     * A name for the promotion - can be used for identifying in the resulting feed the items
     * belonging to the inserted promotion items. The name specified here will be included as the
     * value of the "source_feed" property in the returned items
     */
    promotion_name: S.optional(S.String),
    /**
     * The percentage of the resulting feed to contain items from this promotion (NOTE: this is only
     * used for `feed` type promotions)
     */
    percent: S.optional(pipe(S.Number, S.int())),
    /**
     * Feed_id of a previously created feed config, to be used for the filter to select promotion
     * items (NOTE: this is only used for `feed` type promotions)
     */
    feed_id: S.optional(S.String),
    filters: S.optional(FiltersParam),
    /**
     * The items to be inserted into the main feed (NOTE: this is only used for `items` type
     * promotions)
     */
    promoted_items: S.optional(
      S.Array(
        S.Struct({
          /** The hash of the item to be inserted */
          item_id: S.optional(S.String),
          /** The position (starts from 1) to insert the item into the main feed */
          rank: S.optional(pipe(S.Number, S.int()))
        })
      )
    )
  })
).pipe(
  S.maxItems(10)
)
export type PromotionFiltersParam = S.Schema.Type<typeof PromotionFiltersParam>
export const PromotionFiltersParamEncoded = S.encodedSchema(PromotionFiltersParam)
export type PromotionFiltersParamEncoded = S.Schema.Encoded<typeof PromotionFiltersParam>
