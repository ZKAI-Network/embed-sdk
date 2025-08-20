import { pipe } from "effect"
import * as S from "effect/Schema"

export const CreateDatasourceRequest = S.Struct({
  /** Human-readable name for the datasource */
  name: S.optional(pipe(S.String, S.maxLength(255)))
})
export type CreateDatasourceRequest = S.Schema.Type<typeof CreateDatasourceRequest>
export const CreateDatasourceRequestEncoded = S.encodedSchema(CreateDatasourceRequest)
export type CreateDatasourceRequestEncoded = S.Schema.Encoded<typeof CreateDatasourceRequest>
