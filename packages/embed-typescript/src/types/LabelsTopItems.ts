import { Schema as S } from "effect"

export const LabelsTopItems = S.Struct({
  /**
   * The label to retrieve top scored casts for
   *
   * Available values:
   *
   * Labels in `topics` category
   *
   * - `arts_culture`
   * - `business_entrepreneurs`
   * - `celebrity_pop_culture`
   * - `diaries_daily_life`
   * - `family`
   * - `fashion_style`
   * - `film_tv_video`
   * - `fitness_health`
   * - `food_dining`
   * - `gaming`
   * - `learning_educational`
   * - `music`
   * - `news_social_concern`
   * - `other_hobbies`
   * - `relationships`
   * - `science_technology`
   * - `sports`
   * - `travel_adventure`
   * - `youth_student_life`
   *
   * Labels in `sentiment` category
   *
   * - `positive`
   * - `neutral`
   * - `negative`
   *
   * Labels in `emotion` category
   *
   * - `anger`
   * - `anticipation`
   * - `disgust`
   * - `fear`
   * - `joy`
   * - `love`
   * - `optimism`
   * - `pessimism`
   * - `sadness`
   * - `surprise`
   * - `trust`
   *
   * Labels in `moderation` category
   *
   * - `llm_generated`
   * - `spam`
   * - `sexual`
   * - `hate`
   * - `violence`
   * - `harassment`
   * - `self_harm`
   * - `sexual_minors`
   * - `hate_threatening`
   * - `violence_graphic`
   */
  label: S.String,
  /** Maximum number of casts to return (default 100, max 1000) */
  top_k: S.optional(S.Number),
  /** Whether to reverse the search, ie retrieve the lowest scored items (default false) */
  reverse: S.optional(S.Boolean),
  /** Filtering options to be applied to the feed */
  filters: S.optional(
    S.Struct({
      /** Return only casts that belong to these channels, specified by channel urls (root_parent_url) */
      channels: S.optional(S.Array(S.String)),
      /** Return only casts created by author with specified fid */
      author_id: S.optional(S.String)
    })
  )
}) // LabelsTopItem
export type LabelsTopItems = S.Schema.Type<typeof LabelsTopItems>
export const LabelsTopItemsEncoded = S.encodedSchema(LabelsTopItems)
export type LabelsTopItemsEncoded = S.Schema.Encoded<typeof LabelsTopItems>
