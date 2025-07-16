import * as S from "effect/Schema"
import { AllLabels, EmotionLabels, ModerationLabels, SentimentLabels, TopicLabels } from "../types/LabelLiterals.js"

export const UserSimilarityScore = S.Struct({
  user_id: S.String,
  score: S.Number
})

export const UserLabelTopResult = S.Struct({
  user_id: S.String,
  score: S.Number,
  count: S.Number,
  ratio: S.Number
})

export const UserLabelScore = S.Struct({
  label: AllLabels,
  score: S.Number
})

export const UserTopicLabelScore = S.Struct({
  label: TopicLabels,
  score: S.Number
})

export const UserSentimentLabelScore = S.Struct({
  label: SentimentLabels,
  score: S.Number
})

export const UserEmotionLabelScore = S.Struct({
  label: EmotionLabels,
  score: S.Number
})

export const UserModerationLabelScore = S.Struct({
  label: ModerationLabels,
  score: S.Number
})

export const UserAiLabels = S.Struct({
  topics: S.Array(UserTopicLabelScore),
  sentiment: S.Array(UserSentimentLabelScore),
  emotion: S.Array(UserEmotionLabelScore),
  moderation: S.Array(UserModerationLabelScore)
})

export const UserWithLabels = S.Struct({
  user_id: S.String,
  ai_labels: UserAiLabels
})

export type UserSimilarityScore = S.Schema.Type<typeof UserSimilarityScore>
export type UserLabelTopResult = S.Schema.Type<typeof UserLabelTopResult>
export type UserLabelScore = S.Schema.Type<typeof UserLabelScore>
export type UserTopicLabelScore = S.Schema.Type<typeof UserTopicLabelScore>
export type UserSentimentLabelScore = S.Schema.Type<typeof UserSentimentLabelScore>
export type UserEmotionLabelScore = S.Schema.Type<typeof UserEmotionLabelScore>
export type UserModerationLabelScore = S.Schema.Type<typeof UserModerationLabelScore>
export type UserAiLabels = S.Schema.Type<typeof UserAiLabels>
export type UserWithLabels = S.Schema.Type<typeof UserWithLabels>

export type UserSimilarityResponse = Array<UserSimilarityScore>
export type UserSemanticSearchResponse = Array<UserSimilarityScore>
export type UserTopByLabelResponse = Array<UserLabelTopResult>
export type UserLabelsResponse = Array<UserWithLabels>
