import * as S from "effect/Schema"

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
  label: S.String,
  score: S.Number
})

export const UserAiLabels = S.Struct({
  topics: S.Array(UserLabelScore),
  sentiment: S.Array(UserLabelScore),
  emotion: S.Array(UserLabelScore),
  moderation: S.Array(UserLabelScore)
})

export const UserWithLabels = S.Struct({
  user_id: S.String,
  ai_labels: UserAiLabels
})

export type UserSimilarityScore = S.Schema.Type<typeof UserSimilarityScore>
export type UserLabelTopResult = S.Schema.Type<typeof UserLabelTopResult>
export type UserLabelScore = S.Schema.Type<typeof UserLabelScore>
export type UserAiLabels = S.Schema.Type<typeof UserAiLabels>
export type UserWithLabels = S.Schema.Type<typeof UserWithLabels>

export type UserSimilarityResponse = Array<UserSimilarityScore>
export type UserSemanticSearchResponse = Array<UserSimilarityScore>
export type UserTopByLabelResponse = Array<UserLabelTopResult>
export type UserLabelsResponse = Array<UserWithLabels>
