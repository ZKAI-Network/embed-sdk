import { pipe, Schema as S } from "effect"

export const Error = S.Struct({
  /** Error type or code */
  error: S.optional(S.String),
  /** Human-readable error message */
  message: S.optional(S.String),
  /** HTTP status code */
  code: S.optional(pipe(S.Number, S.int()))
})
export type Error = S.Schema.Type<typeof Error>
export const ErrorEncoded = S.encodedSchema(Error)
export type ErrorEncoded = S.Schema.Encoded<typeof Error>
