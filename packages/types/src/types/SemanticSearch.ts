import { pipe } from "effect"
import * as S from "effect/Schema"

export const SemanticSearch = S.Struct({
  /** A description of what to search for */
  query: S.String,
  /** Maximum number of casts to return (default 10, max 100) */
  top_k: S.optional(pipe(S.Number, S.int())),
  /**
   * Whether to include AI labels in search results (note that only we officially only support
   * English content for AI labels at the moment)
   */
  return_ai_labels: S.optional(S.Boolean),
  /** Whether to include metadata (embed items, processed text) in results */
  return_metadata: S.optional(S.Boolean),
  /** Filtering options to be applied to the search */
  filters: S.optional(
    S.Struct({
      /** Return only casts after this start_timestamp, specified as Epoch time (Unix timestamp) */
      start_timestamp: S.optional(S.String),
      /** Return only casts before this end_timestamp, specified as Epoch time (Unix timestamp) */
      end_timestamp: S.optional(S.String),
      /** Return only casts that have these AI labels */
      ai_labels: S.optional(S.Array(S.String)),
      /** Fid of the author of the cast */
      author_id: S.optional(S.String),
      /** Return only casts in specific channels, specified by the channel url (root_parent_url) */
      channels: S.optional(S.Array(S.String)),
      /** Whether to limit search to only frames */
      frames_only: S.optional(S.Boolean),
      /** Return only casts with specific domains embedded */
      embed_domains: S.optional(S.Array(S.String))
    })
  )
}) // SemanticSearch
export type SemanticSearch = S.Schema.Type<typeof SemanticSearch>
export const SemanticSearchEncoded = S.encodedSchema(SemanticSearch)
export type SemanticSearchEncoded = S.Schema.Encoded<typeof SemanticSearch>
