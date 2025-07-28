import { pipe } from "effect"
import * as S from "effect/Schema"

export const Item = S.Struct({
  /** Format: protocol.protocol_item_id */
  item_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"))),
  /** Source protocol */
  protocol: S.Literal("farcaster", "mirror", "lens"),
  /** Format: protocol.protocol_user_id */
  author_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"))),
  /** ISO 8601 UTC timestamp */
  created_at: pipe(S.String, S.pattern(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"))),
  /** ISO 8601 UTC timestamp */
  updated_at: pipe(S.String, S.pattern(new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"))),
  /** Type of content */
  publication_type: S.Literal("text_only", "frame", "article", "image", "video", "audio"),
  /** Parent/root item ID */
  root_item_id: pipe(S.String, S.pattern(new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"))),
  /** Language confidence score */
  language_score: pipe(S.Number, S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(1)),
  /** Item title */
  title: S.optional(S.String),
  /** Main content/text */
  content: S.optional(S.String),
  /** Content summary */
  excerpt: S.optional(S.String),
  /** Array of tag strings */
  tags: S.optional(S.Array(S.String)),
  /** Language code */
  language: S.optional(S.Literal("en", "es", "fr", "de", "pt", "it", "ja", "ko", "zh", "ru", "ar")),
  /** Array of image URLs */
  image_urls: S.optional(S.Array(pipe(S.String, S.pattern(new RegExp("^https?://.*$"))))),
  /** Video URL */
  video_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Audio URL */
  audio_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Cover image URL */
  cover_image_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Thumbnail URL */
  thumbnail_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** View count */
  view_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Like count */
  like_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Comment count */
  comment_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Share count */
  share_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Bookmark count */
  bookmark_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Word count */
  word_count: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Estimated read time */
  read_time_minutes: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
  /** Publication status */
  is_published: S.optional(S.Boolean),
  /** Featured status */
  is_featured: S.optional(S.Boolean),
  /** Pinned status */
  is_pinned: S.optional(S.Boolean),
  /** Original source URL */
  source_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Canonical URL */
  canonical_url: S.optional(pipe(S.String, S.pattern(new RegExp("^https?://.*$")))),
  /** Geographic location */
  location: S.optional(S.String),
  /** Protocol-specific metadata */
  metadata: S.optional(S.Struct({})),
  /** Custom fields */
  custom_fields: S.optional(S.Struct({}))
})
export type Item = S.Schema.Type<typeof Item>
export const ItemEncoded = S.encodedSchema(Item)
export type ItemEncoded = S.Schema.Encoded<typeof Item>
