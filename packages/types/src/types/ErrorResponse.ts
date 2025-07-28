import * as S from "effect/Schema"

export const ErrorResponse = S.Struct({
  /** Error message */
  error: S.String,
  /** Detailed error information (for validation errors) */
  details: S.optional(S.Array(S.String)),
  /** Debug information (for development) */
  debug_info: S.optional(S.Struct({}))
})
export type ErrorResponse = S.Schema.Type<typeof ErrorResponse>
export const ErrorResponseEncoded = S.encodedSchema(ErrorResponse)
export type ErrorResponseEncoded = S.Schema.Encoded<typeof ErrorResponse>
