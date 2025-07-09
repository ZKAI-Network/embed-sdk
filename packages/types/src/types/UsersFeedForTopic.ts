import { Schema as S } from "effect"

import { TopicParam } from "./TopicParam.js"

export const UsersFeedForTopic = S.Struct({
  topic: TopicParam,
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
  event_type: S.optional(S.String)
}) // UsersFeedForTopic
export type UsersFeedForTopic = S.Schema.Type<typeof UsersFeedForTopic>
export const UsersFeedForTopicEncoded = S.encodedSchema(UsersFeedForTopic)
export type UsersFeedForTopicEncoded = S.Schema.Encoded<typeof UsersFeedForTopic>
