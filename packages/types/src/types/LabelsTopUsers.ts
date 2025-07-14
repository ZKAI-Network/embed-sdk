import * as S from "effect/Schema"

import { AllLabels } from "./LabelLiterals.js"

/**
 * Activity types for user scoring
 */
const ActivityScoringTypes = S.Literal("post", "like", "recast", "reply", "all")

export const LabelsTopUsers = S.Struct({
  /**
   * The label to retrieve top scored users for
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
  label: AllLabels,
  /** Maximum number of users to return (default 100, max 1000) */
  top_k: S.optional(S.Number),
  /** Whether to reverse the search, ie retrieve the lowest scored items (default false) */
  reverse: S.optional(S.Boolean),
  /**
   * The type of activity the scoring should be based on
   *
   * Available values:
   *
   *     -`post` - `like` - `recast` - `reply` - `all`;
   */
  scoring: S.optional(ActivityScoringTypes),
  /**
   * The minimum number of activity count required for the user to be included in the results
   * (default 10)
   */
  minimum_activity_count: S.optional(S.Number),
  /**
   * The minimum ratio of activity related to the specified label (must be a value between 0 and 1 -
   * default 0.75)
   */
  ratio_min: S.optional(S.Number),
  /**
   * The minimum AI model confidence score for the specified label (must be a value between 0 and 1
   * - default 0.6)
   */
  conf_min: S.optional(S.Number)
}) // LabelsTopUsers
export type LabelsTopUsers = S.Schema.Type<typeof LabelsTopUsers>
export const LabelsTopUsersEncoded = S.encodedSchema(LabelsTopUsers)
export type LabelsTopUsersEncoded = S.Schema.Encoded<typeof LabelsTopUsers>
