import { pipe } from "effect"
import * as S from "effect/Schema"

export const User = S.Struct({
  /** Format: protocol.protocol_user_id */
  user_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"))),
  /** Source protocol */
  protocol: S.Literal("farcaster", "mirror", "lens", "twitter", "instagram"),
  /** ISO 8601 UTC timestamp */
  created_at: pipe(S.String, S.pattern(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"))),
  /** ISO 8601 UTC timestamp */
  updated_at: pipe(S.String, S.pattern(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"))),
  /** Username/handle */
  username: S.optional(S.String),
  /** Display name */
  display_name: S.optional(S.String),
  /** User biography */
  bio: S.optional(S.String),
  /** Email address */
  email: S.optional(
    pipe(
      S.String,
      S.pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
    )
  ),
  /** Avatar image URL */
  avatar_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Banner image URL */
  banner_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Website URL */
  website: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Geographic location */
  location: S.optional(S.String),
  /** Follower count */
  follower_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Following count */
  following_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Post count */
  post_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Verification status */
  verified: S.optional(S.Boolean),
  /** Array of tag strings */
  tags: S.optional(S.Array(S.String)),
  /** User preferences */
  preferences: S.optional(S.Struct({})),
  /** Protocol-specific metadata */
  metadata: S.optional(S.Struct({}))
})
export type User = S.Schema.Type<typeof User>
export const UserEncoded = S.encodedSchema(User)
export type UserEncoded = S.Schema.Encoded<typeof User>
