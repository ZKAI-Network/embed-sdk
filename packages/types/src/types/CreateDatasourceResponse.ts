import { pipe } from "effect"
import * as S from "effect/Schema"

export const CreateDatasourceResponse = S.Struct({
  /** Unique datasource identifier */
  datasource_id: pipe(S.String, S.pattern(new RegExp("^datasource-[a-zA-Z0-9]+-[a-zA-Z0-9]+$"))),
  /** Customer ID associated with the datasource */
  customer_id: S.String,
  /** Current status of the datasource */
  status: S.Literal("provisioning", "active", "error"),
  /** Human-readable name (if provided) */
  name: S.optional(S.String)
})
export type CreateDatasourceResponse = S.Schema.Type<typeof CreateDatasourceResponse>
export const CreateDatasourceResponseEncoded = S.encodedSchema(CreateDatasourceResponse)
export type CreateDatasourceResponseEncoded = S.Schema.Encoded<typeof CreateDatasourceResponse>
