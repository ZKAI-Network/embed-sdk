import * as S from "effect/Schema"

export const UsersSemanticSearch = S.Struct({
  /** A query prompt about what to search */
  query: S.String,
  /** Maximum number of users to return */
  top_k: S.optional(S.Number)
}) // UsersSemanticSearch
export type UsersSemanticSearch = S.Schema.Type<typeof UsersSemanticSearch>
export const UsersSemanticSearchEncoded = S.encodedSchema(UsersSemanticSearch)
export type UsersSemanticSearchEncoded = S.Schema.Encoded<typeof UsersSemanticSearch>
