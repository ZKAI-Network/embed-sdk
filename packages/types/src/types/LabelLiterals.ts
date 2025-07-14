import * as S from "effect/Schema"

/**
 * Topic labels - content classification by topic/theme
 */
export const TopicLabels = S.Literal(
  "arts_culture",
  "business_entrepreneurs",
  "celebrity_pop_culture",
  "diaries_daily_life",
  "family",
  "fashion_style",
  "film_tv_video",
  "fitness_health",
  "food_dining",
  "gaming",
  "learning_educational",
  "music",
  "news_social_concern",
  "other_hobbies",
  "relationships",
  "science_technology",
  "sports",
  "travel_adventure",
  "youth_student_life"
)

/**
 * Sentiment labels - emotional tone classification
 */
export const SentimentLabels = S.Literal(
  "positive",
  "neutral",
  "negative"
)

/**
 * Emotion labels - specific emotion detection
 */
export const EmotionLabels = S.Literal(
  "anger",
  "anticipation",
  "disgust",
  "fear",
  "joy",
  "love",
  "optimism",
  "pessimism",
  "sadness",
  "surprise",
  "trust"
)

/**
 * Moderation labels - content safety classification
 */
export const ModerationLabels = S.Literal(
  "llm_generated",
  "spam",
  "sexual",
  "hate",
  "violence",
  "harassment",
  "self_harm",
  "sexual_minors",
  "hate_threatening",
  "violence_graphic"
)

/**
 * Web3 topic labels - blockchain/crypto related content
 */
export const Web3Labels = S.Literal(
  "web3_nft",
  "web3_defi",
  "web3_infra",
  "web3_industry",
  "web3_consumer"
)

/**
 * All available labels - union of all label categories
 */
export const AllLabels = S.Union(
  TopicLabels,
  SentimentLabels,
  EmotionLabels,
  ModerationLabels,
  Web3Labels
)

/**
 * Label category names for filtering by category
 */
export const LabelCategories = S.Literal(
  "topics",
  "sentiment",
  "emotion",
  "moderation",
  "web3_topics",
  "all"
)

export type TopicLabels = S.Schema.Type<typeof TopicLabels>
export type SentimentLabels = S.Schema.Type<typeof SentimentLabels>
export type EmotionLabels = S.Schema.Type<typeof EmotionLabels>
export type ModerationLabels = S.Schema.Type<typeof ModerationLabels>
export type Web3Labels = S.Schema.Type<typeof Web3Labels>
export type AllLabels = S.Schema.Type<typeof AllLabels>
export type LabelCategories = S.Schema.Type<typeof LabelCategories>
