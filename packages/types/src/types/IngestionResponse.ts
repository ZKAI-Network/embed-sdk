import { pipe } from "effect"
import * as S from "effect/Schema"

export const IngestionResponse = S.Struct({
  /** Success message */
  message: S.String,
  /** Target Kinesis stream name */
  stream_name: S.String,
  /** Kinesis sequence number (for single records) */
  sequence_number: S.optional(S.String),
  /** Total number of records (for bulk operations) */
  total_records: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Number of successfully processed records (for bulk operations) */
  successful_records: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Number of failed records (for bulk operations) */
  failed_records: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0)))
})

// Raw API response (internal use only)
export const IngestionApiResponse = S.Struct({
  status_code: pipe(S.Number, S.int()),
  body: IngestionResponse
})

export type IngestionResponse = S.Schema.Type<typeof IngestionResponse>
export const IngestionResponseEncoded = S.encodedSchema(IngestionResponse)
export type IngestionResponseEncoded = S.Schema.Encoded<typeof IngestionResponse>
export type IngestionApiResponse = S.Schema.Type<typeof IngestionApiResponse> // Internal use only
