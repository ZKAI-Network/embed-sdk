import { pipe, Schema as S } from "effect"

export const ForYouResponse = S.Struct({
  /** HTTP status code */
  status_code: S.optional(pipe(S.Number, S.int())),
  /** Array of recommended post items with scoring information */
  body: S.optional(
    S.Array(
      S.Struct({
        /** Unique identifier (hash) for the post item */
        item_id: S.optional(S.String),
        /** Popularity score for the post */
        popular_score: S.optional(S.Number),
        /** Trending score for the post */
        trending_score: S.optional(S.Number),
        /** Length of the post text in characters */
        text_length: S.optional(pipe(S.Number, S.int())),
        /** User affinity score for the post (based on following graph) */
        affinity_score: S.optional(S.Number),
        /**
         * Array of social proof indicators (users followed by the requesting user who interacted with
         * this post)
         */
        social_proof: S.optional(
          S.Array(
            S.Struct({
              /** FID of the user who interacted with the post */
              user_id: S.optional(pipe(S.Number, S.int())),
              /** Unix timestamp of the interaction */
              timestamp: S.optional(pipe(S.Number, S.int())),
              /** Type of interaction */
              interaction: S.optional(S.Literal("like", "share", "comment"))
            })
          )
        ),
        /**
         * Interest score for the post (based on user's past interactions). May be omitted when scoring
         * is set to 'none'.
         */
        interest_score: S.optional(S.Number),
        /** Final combined score for ranking */
        score: S.optional(S.Number),
        /** Score adjusted by time decay and other factors */
        adjusted_score: S.optional(S.Number),
        /**
         * Identifies which feed source this post came from. Format: "{type}:{feed_id}" (e.g.,
         * "main:feed_3380", "fallback_main_1:feed_406")
         */
        source_feed: S.optional(S.String),
        /** Additional metadata about the post. Only included when return_metadata is set to true. */
        metadata: S.optional(
          S.Struct({
            /** Content of the post */
            text: S.optional(S.String),
            /** Array of embedded media URLs */
            embed_items: S.optional(S.Array(S.String)),
            /** Unix timestamp when post was created */
            timestamp: S.optional(pipe(S.Number, S.int())),
            root_parent_hash: S.optional(S.String),
            parent_hash: S.optional(S.Union(S.String, S.Null)),
            root_parent_url: S.optional(S.Union(S.String, S.Null)),
            mentioned_profiles: S.optional(S.Array(S.String)),
            ai_labels: S.optional(
              S.Struct({
                topics: S.optional(S.Array(S.String)),
                sentiment: S.optional(S.Array(S.String)),
                emotion: S.optional(S.Array(S.String)),
                moderation: S.optional(S.Array(S.String)),
                web3_topics: S.optional(S.Array(S.String))
              })
            ),
            /** FID of the app that created the post */
            app_fid: S.optional(S.String),
            geo_location: S.optional(
              S.Union(
                /** Geographic location as latitude,longitude */
                S.String,
                /** Geographic location as latitude,longitude */
                S.Null
              )
            ),
            likes_count: S.optional(pipe(S.Number, S.int())),
            comments_count: S.optional(pipe(S.Number, S.int())),
            shares_count: S.optional(pipe(S.Number, S.int())),
            author: S.optional(
              S.Struct({
                user_id: S.optional(pipe(S.Number, S.int())),
                username: S.optional(S.String),
                display_name: S.optional(S.String),
                pfp_url: S.optional(S.String),
                spam_score: S.optional(S.Number)
              })
            )
          })
        )
      })
    )
  )
})
export type ForYouResponse = S.Schema.Type<typeof ForYouResponse>
export const ForYouResponseEncoded = S.encodedSchema(ForYouResponse)
export type ForYouResponseEncoded = S.Schema.Encoded<typeof ForYouResponse>
