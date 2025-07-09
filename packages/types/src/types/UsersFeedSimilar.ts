import { Schema as S } from "effect"

export const UsersFeedSimilar = S.Struct({
  /** A user_id (fid) to search similar users */
  user_id: S.String,
  /** Maximum number of users to return */
  top_k: S.optional(S.Number)
}) // UsersFeedSimilar
export type UsersFeedSimilar = S.Schema.Type<typeof UsersFeedSimilar>
export const UsersFeedSimilarEncoded = S.encodedSchema(UsersFeedSimilar)
export type UsersFeedSimilarEncoded = S.Schema.Encoded<typeof UsersFeedSimilar>
