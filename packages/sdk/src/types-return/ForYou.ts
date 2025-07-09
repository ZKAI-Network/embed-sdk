import { pipe, Schema as S } from "effect"

// Social proof interaction entry
export const SocialProofEntry = S.Struct({
  user_id: pipe(S.Number, S.int()),
  timestamp: pipe(S.Number, S.int()),
  interaction: S.Literal("like", "comment", "share")
})

// Following engagement metrics
export const FollowingEngagement = S.Struct({
  comment: pipe(S.Number, S.int()),
  share: pipe(S.Number, S.int()),
  like: pipe(S.Number, S.int())
})

// AI labels for content classification
export const AILabels = S.Struct({
  topics: S.Array(S.String),
  sentiment: S.Array(S.String),
  nsfw: S.optional(S.Array(S.String)),
  quality_score: S.optional(S.Number)
})

// Author information
export const Author = S.Struct({
  user_id: pipe(S.Number, S.int()),
  username: S.String,
  display_name: S.optional(S.String),
  pfp_url: S.optional(S.String),
  follower_count: S.optional(pipe(S.Number, S.int())),
  following_count: S.optional(pipe(S.Number, S.int())),
  verified: S.optional(S.Boolean),
  bio: S.optional(S.String)
})

// Cast metadata containing all the cast details
export const CastMetadata = S.Struct({
  text: S.String,
  embed_items: S.Array(S.String),
  timestamp: pipe(S.Number, S.int()),
  root_parent_hash: S.String,
  parent_hash: S.NullOr(S.String),
  root_parent_url: S.NullOr(S.String),
  mentioned_profiles: S.Array(S.String),
  ai_labels: AILabels,
  quality_score: S.Number,
  likes_count: pipe(S.Number, S.int()),
  comments_count: pipe(S.Number, S.int()),
  shares_count: pipe(S.Number, S.int()),
  author: Author
})

// Individual feed item
export const ForYouFeedItem = S.Struct({
  item_id: S.String,
  score: S.Number,
  following_engagement: FollowingEngagement,
  social_proof: S.Array(SocialProofEntry),
  source_feed: S.String,
  metadata: S.optional(CastMetadata)
})

// Raw API response (internal use only)
export const ForYouApiResponse = S.Struct({
  status_code: pipe(S.Number, S.int()),
  body: S.Array(ForYouFeedItem)
})

// Export types
export type SocialProofEntry = S.Schema.Type<typeof SocialProofEntry>
export type FollowingEngagement = S.Schema.Type<typeof FollowingEngagement>
export type AILabels = S.Schema.Type<typeof AILabels>
export type Author = S.Schema.Type<typeof Author>
export type CastMetadata = S.Schema.Type<typeof CastMetadata>
export type ForYouFeedItem = S.Schema.Type<typeof ForYouFeedItem>
export type ForYouResponse = Array<ForYouFeedItem> // Unwrapped - direct array of feed items
export type ForYouApiResponse = S.Schema.Type<typeof ForYouApiResponse> // Internal use only

// Export encoded schemas
export const SocialProofEntryEncoded = S.encodedSchema(SocialProofEntry)
export const FollowingEngagementEncoded = S.encodedSchema(FollowingEngagement)
export const AILabelsEncoded = S.encodedSchema(AILabels)
export const AuthorEncoded = S.encodedSchema(Author)
export const CastMetadataEncoded = S.encodedSchema(CastMetadata)
export const ForYouFeedItemEncoded = S.encodedSchema(ForYouFeedItem)
export const ForYouApiResponseEncoded = S.encodedSchema(ForYouApiResponse)

// Export encoded types
export type SocialProofEntryEncoded = S.Schema.Encoded<typeof SocialProofEntry>
export type FollowingEngagementEncoded = S.Schema.Encoded<typeof FollowingEngagement>
export type AILabelsEncoded = S.Schema.Encoded<typeof AILabels>
export type AuthorEncoded = S.Schema.Encoded<typeof Author>
export type CastMetadataEncoded = S.Schema.Encoded<typeof CastMetadata>
export type ForYouFeedItemEncoded = S.Schema.Encoded<typeof ForYouFeedItem>
export type ForYouApiResponseEncoded = S.Schema.Encoded<typeof ForYouApiResponse>
