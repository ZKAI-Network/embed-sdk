import { pipe } from "effect"
import * as S from "effect/Schema"

import { FiltersParam } from "./FiltersParam.js"

export const Similar = S.Struct({
  /** The ID of the cast to retrieve a list of similar casts for */
  item_id: S.String,
  /**
   * Maximum number of casts to return (max 50 if return_ai_labels or return_metatdata is set to
   * true)
   */
  top_k: S.optional(pipe(S.Number, S.int())),
  /** Whether to include metadata (embed items, processed text, author fid) in results */
  return_metadata: S.optional(S.Boolean),
  filters: S.optional(FiltersParam)
})
export type Similar = S.Schema.Type<typeof Similar>
export const SimilarEncoded = S.encodedSchema(Similar)
export type SimilarEncoded = S.Schema.Encoded<typeof Similar>
