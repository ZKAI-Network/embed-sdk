import * as S from "effect/Schema"

export const UsersFeedForItem = S.Struct({
  /** Item_id for fetching users feed */
  item_id: S.String,
  /**
   * Event_type for fetching users feed
   *
   * Available values:
   *
   * - `like`
   * - `share`
   * - `comment`
   * - `all`
   */
  event_type: S.String
}) // UsersFeedForItem
export type UsersFeedForItem = S.Schema.Type<typeof UsersFeedForItem>
export const UsersFeedForItemEncoded = S.encodedSchema(UsersFeedForItem)
export type UsersFeedForItemEncoded = S.Schema.Encoded<typeof UsersFeedForItem>
