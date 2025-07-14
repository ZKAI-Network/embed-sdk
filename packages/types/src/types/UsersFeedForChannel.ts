import * as S from "effect/Schema"

export const UsersFeedForChannel = S.Struct({
  /**
   * Channel url for fetching users feed
   *
   * You can get farcaster channels list from [here](https://api.warpcast.com/v2/all-channels).
   */
  channel: S.String,
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
}) // UsersFeedForChannel
export type UsersFeedForChannel = S.Schema.Type<typeof UsersFeedForChannel>
export const UsersFeedForChannelEncoded = S.encodedSchema(UsersFeedForChannel)
export type UsersFeedForChannelEncoded = S.Schema.Encoded<typeof UsersFeedForChannel>
