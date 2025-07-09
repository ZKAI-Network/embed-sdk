import { Schema as S } from "effect"

/**
 * Return only casts that have these AI labels Available values:
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
 *
 * Labels in `web3_topics` category
 *
 * - `web3_nft`
 * - `web3_defi`
 * - `web3_infra`
 * - `web3_industry`
 * - `web3_consumer`
 */
export const AILabelsFilterParam = S.Array(S.String)
export type AILabelsFilterParam = S.Schema.Type<typeof AILabelsFilterParam>
export const AILabelsFilterParamEncoded = S.encodedSchema(AILabelsFilterParam)
export type AILabelsFilterParamEncoded = S.Schema.Encoded<typeof AILabelsFilterParam>
