import * as S from "effect/Schema"

export const ValidationErrorResponse = S.Struct({
  /** Error type */
  error: S.String,
  /** List of validation errors */
  details: S.Array(S.String)
})
export type ValidationErrorResponse = S.Schema.Type<typeof ValidationErrorResponse>
export const ValidationErrorResponseEncoded = S.encodedSchema(ValidationErrorResponse)
export type ValidationErrorResponseEncoded = S.Schema.Encoded<typeof ValidationErrorResponse>
