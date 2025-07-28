import { pipe } from "effect"
import * as S from "effect/Schema"

const BaseInteraction = S.Struct({
  /** Format: protocol.protocol_item_id */
  item_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"))),
  /** Unix epoch timestamp */
  timestamp: pipe(S.Number, S.int()),
  /** Type of interaction */
  event_type: S.Literal("view", "like", "comment", "share", "bookmark")
})

const UserInteraction = S.extend(
  BaseInteraction,
  S.Struct({
    /** Format: protocol.protocol_user_id (required if session_id not provided) */
    user_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$")))
  })
)

const SessionInteraction = S.extend(
  BaseInteraction,
  S.Struct({
    /** Session identifier for anonymous users (required if user_id not provided) */
    session_id: S.String
  })
)

export const Interaction = S.Union(UserInteraction, SessionInteraction)
export type Interaction = S.Schema.Type<typeof Interaction>
export const InteractionEncoded = S.encodedSchema(Interaction)
export type InteractionEncoded = S.Schema.Encoded<typeof Interaction>
