import { Schema as S } from "effect"

export const Empty = S.Struct({}) // Empty Schema
export type Empty = S.Schema.Type<typeof Empty>
export const EmptyEncoded = S.encodedSchema(Empty)
export type EmptyEncoded = S.Schema.Encoded<typeof Empty>
