import { Schema as S } from "effect"

import { LabelCategories } from "./LabelLiterals.js"

export const LabelsForItems = S.Struct({
  /** List of casts to retrieve labels for */
  items_list: S.Array(S.String),
  /**
   * The category of labels to retrieve.
   *
   * Available values for label_category: `topics`, `sentiment`, `emotion`, `moderation`, `all`
   *
   * - `topics` - include the following labels
   *
   *   - `arts_culture`
   *   - `business_entrepreneurs`
   *   - `celebrity_pop_culture`
   *   - `diaries_daily_life`
   *   - `family`
   *   - `fashion_style`
   *   - `film_tv_video`
   *   - `fitness_health`
   *   - `food_dining`
   *   - `gaming`
   *   - `learning_educational`
   *   - `music`
   *   - `news_social_concern`
   *   - `other_hobbies`
   *   - `relationships`
   *   - `science_technology`
   *   - `sports`
   *   - `travel_adventure`
   *   - `youth_student_life`
   * - `sentiment` - include the following labels
   *
   *   - `positive`
   *   - `neutral`
   *   - `negative`
   * - `emotion` - include the following labels
   *
   *   - `anger`
   *   - `anticipation`
   *   - `disgust`
   *   - `fear`
   *   - `joy`
   *   - `love`
   *   - `optimism`
   *   - `pessimism`
   *   - `sadness`
   *   - `surprise`
   *   - `trust`
   * - `moderation` - include the following labels
   *
   *   - `llm_generated`
   *   - `spam`
   *   - `sexual`
   *   - `hate`
   *   - `violence`
   *   - `harassment`
   *   - `self_harm`
   *   - `sexual_minors`
   *   - `hate_threatening`
   *   - `violence_graphic`
   * - `all` - include all labels above
   */
  label_category: LabelCategories
}) // LabelsForItems
export type LabelsForItems = S.Schema.Type<typeof LabelsForItems>
export const LabelsForItemsEncoded = S.encodedSchema(LabelsForItems)
export type LabelsForItemsEncoded = S.Schema.Encoded<typeof LabelsForItems>
