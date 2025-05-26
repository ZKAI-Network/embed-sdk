import { Schema as S } from "effect"

/**
 * Topic for fetching users feed
 *
 * Available Values:
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
 */
export const TopicParam = S.String // TopicParam
export type TopicParam = S.Schema.Type<typeof TopicParam>
export const TopicParamEncoded = S.encodedSchema(TopicParam)
export type TopicParamEncoded = S.Schema.Encoded<typeof TopicParam>
