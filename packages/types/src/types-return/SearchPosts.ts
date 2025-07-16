import * as S from "effect/Schema"
import {
  AllLabels,
  EmotionLabels,
  ModerationLabels,
  SentimentLabels,
  TopicLabels,
  Web3Labels
} from "../types/LabelLiterals.js"

export const PostItemScore = S.Struct({
  item_id: S.String,
  score: S.Number
})

export const PostLabelScore = S.Struct({
  label: AllLabels,
  score: S.Number
})

export const PostTopicLabelScore = S.Struct({
  label: TopicLabels,
  score: S.Number
})

export const PostSentimentLabelScore = S.Struct({
  label: SentimentLabels,
  score: S.Number
})

export const PostEmotionLabelScore = S.Struct({
  label: EmotionLabels,
  score: S.Number
})

export const PostModerationLabelScore = S.Struct({
  label: ModerationLabels,
  score: S.Number
})

export const PostWeb3LabelScore = S.Struct({
  label: Web3Labels,
  score: S.Number
})

export const PostAiLabels = S.Struct({
  topics: S.optional(S.Array(PostTopicLabelScore)),
  sentiment: S.optional(S.Array(PostSentimentLabelScore)),
  emotion: S.optional(S.Array(PostEmotionLabelScore)),
  moderation: S.optional(S.Array(PostModerationLabelScore)),
  web3_topics: S.optional(S.Array(PostWeb3LabelScore))
})

export const PostWithLabels = S.Struct({
  item_id: S.String,
  ai_labels: S.optional(PostAiLabels)
})

export const PostModerationLabels = S.Struct({
  moderation: S.Array(PostModerationLabelScore)
})

export type PostItemScore = S.Schema.Type<typeof PostItemScore>
export type PostLabelScore = S.Schema.Type<typeof PostLabelScore>
export type PostTopicLabelScore = S.Schema.Type<typeof PostTopicLabelScore>
export type PostSentimentLabelScore = S.Schema.Type<typeof PostSentimentLabelScore>
export type PostEmotionLabelScore = S.Schema.Type<typeof PostEmotionLabelScore>
export type PostModerationLabelScore = S.Schema.Type<typeof PostModerationLabelScore>
export type PostWeb3LabelScore = S.Schema.Type<typeof PostWeb3LabelScore>
export type PostAiLabels = S.Schema.Type<typeof PostAiLabels>
export type PostWithLabels = S.Schema.Type<typeof PostWithLabels>
export type PostModerationLabels = S.Schema.Type<typeof PostModerationLabels>

export type PostLabelsResponse = Array<PostModerationLabels>
export type PostSemanticSearchResponse = Array<PostItemScore>
