/**
 * Generic POST request to any embed API endpoint
 */
export * as http from "./api/common/http.js"

/**
 * Get the "for you" feed from Farcaster casts
 */
export * as for-you from "./api/farcaster/casts/feed/for-you.js"

/**
 * Get popular casts
 */
export * as popular from "./api/farcaster/casts/feed/popular.js"

/**
 * Get trending casts
 */
export * as trending from "./api/farcaster/casts/feed/trending.js"

/**
 * Semantic search for casts
 */
export * as semantic from "./api/farcaster/casts/search/semantic.js"

/**
 * Promise-based wrapper for the mbd.xyz HTTP client
 * This provides a familiar Promise API while using the underlying Effect implementation
 */
export * as client from "./client.js"

/**
 * Configuration for the embed API client
 */
export * as client-effect from "./client-effect.js"

/**
 * EFFECT-BASED API USAGE
 */
export * as example from "./example.js"

/**
 * Return only casts that have these AI labels Available values:
 *
 * Labels in `topics` category
 *
 * - `arts_culture`
 * - `business_entrepreneurs`
 * - `celebrity_pop_culture`
 * - `diaries_daily_life`
 * - `family`
 * - `fashion_style`
 * - `film_tv_video`
 * - `fitness_health`
 * - `food_dining`
 * - `gaming`
 * - `learning_educational`
 * - `music`
 * - `news_social_concern`
 * - `other_hobbies`
 * - `relationships`
 * - `science_technology`
 * - `sports`
 * - `travel_adventure`
 * - `youth_student_life`
 *
 * Labels in `sentiment` category
 *
 * - `positive`
 * - `neutral`
 * - `negative`
 *
 * Labels in `emotion` category
 *
 * - `anger`
 * - `anticipation`
 * - `disgust`
 * - `fear`
 * - `joy`
 * - `love`
 * - `optimism`
 * - `pessimism`
 * - `sadness`
 * - `surprise`
 * - `trust`
 *
 * Labels in `moderation` category
 *
 * - `llm_generated`
 * - `spam`
 * - `sexual`
 * - `hate`
 * - `violence`
 * - `harassment`
 * - `self_harm`
 * - `sexual_minors`
 * - `hate_threatening`
 * - `violence_graphic`
 *
 * Labels in `web3_topics` category
 *
 * - `web3_nft`
 * - `web3_defi`
 * - `web3_infra`
 * - `web3_industry`
 * - `web3_consumer`
 */
export * as AILabelsFilterParam from "./types/AILabelsFilterParam.js"

/**
 * This specifies a feed to be used when a user is under "cold start", meaning that the user is
 * either new to the system or haven't interacted with the system for a long time. When a user is in
 * "cold start", engagement based recommendations is less reliable, and it might be beneficial to
 * use a different feed configuration
 */
export * as ColdstartParam from "./types/ColdstartParam.js"


export * as Empty from "./types/Empty.js"

/**
 * A feed can "run out of items" when a user has seen all items satisfying the feed configuration
 * options. Fallback feeds specifies alternative feeds to show the user when the main feed runs out.
 * A maximum of 3 fallback feeds can be specified, and they will be used in the order specified,
 * when the previous active feed is completely consumed.
 */
export * as FallbackFeedsParam from "./types/FallbackFeedsParam.js"

/**
 * Configurations that help improve the perceived diversity of the feed. Post are returned in order
 * of relevancy to the user based on the scoring algorithm, and thus it is possible that multiple
 * posts from the same user are returned in the same feed. Use these configurations to control how
 * the API should handle multiple posts from the same author
 */
export * as FeedDiversityConfigParam from "./types/FeedDiversityConfigParam.js"

/**
   * Return only casts after this start_timestamp, specified as either an Epoch timestamp (Unix
   * timestamp), or a relative time syntax specifying either a number of days ago or a number of
   * hours ago (see example)
   *
   * Examples:
   *
   * - "1577836800"
   * - "days_ago:7"
   * - "hours_ago:12"
   */
export * as FiltersParam from "./types/FiltersParam.js"

/**
   * Fid of user to get recommendations for
   *
   * NOTE:
   *
   * - Wallet_address is ignored if user_id is specified
   * - At least one of user_id and wallet_address is required
   */
export * as ForYou from "./types/ForYou.js"

/**
   * Cast list to be reranked for user (specified in the `user_id` parameter)
   *
   * The maximum number of items in `items_list` is 500
   */
export * as ForYouReranked from "./types/ForYouReranked.js"

/**
   * The category of labels to retrieve.
   *
   * Available values for label_category: `topics`, `sentiment`, `emotion`, `moderation`, `all`
   *
   * - `topics` - include the following labels
   *
   *   - `arts_culture`
   *   - `business_entrepreneurs`
   *   - `celebrity_pop_culture`
   *   - `diaries_daily_life`
   *   - `family`
   *   - `fashion_style`
   *   - `film_tv_video`
   *   - `fitness_health`
   *   - `food_dining`
   *   - `gaming`
   *   - `learning_educational`
   *   - `music`
   *   - `news_social_concern`
   *   - `other_hobbies`
   *   - `relationships`
   *   - `science_technology`
   *   - `sports`
   *   - `travel_adventure`
   *   - `youth_student_life`
   * - `sentiment` - include the following labels
   *
   *   - `positive`
   *   - `neutral`
   *   - `negative`
   * - `emotion` - include the following labels
   *
   *   - `anger`
   *   - `anticipation`
   *   - `disgust`
   *   - `fear`
   *   - `joy`
   *   - `love`
   *   - `optimism`
   *   - `pessimism`
   *   - `sadness`
   *   - `surprise`
   *   - `trust`
   * - `moderation` - include the following labels
   *
   *   - `llm_generated`
   *   - `spam`
   *   - `sexual`
   *   - `hate`
   *   - `violence`
   *   - `harassment`
   *   - `self_harm`
   *   - `sexual_minors`
   *   - `hate_threatening`
   *   - `violence_graphic`
   * - `all` - include all labels above
   */
export * as LabelsForItems from "./types/LabelsForItems.js"

/**
   * The category of labels to retrieve.
   *
   * Available values for label_category: `topics`, `sentiment`, `emotion`, `moderation`
   *
   * - `topics` - include the following labels
   *
   *   - `arts_culture`
   *   - `business_entrepreneurs`
   *   - `celebrity_pop_culture`
   *   - `diaries_daily_life`
   *   - `family`
   *   - `fashion_style`
   *   - `film_tv_video`
   *   - `fitness_health`
   *   - `food_dining`
   *   - `gaming`
   *   - `learning_educational`
   *   - `music`
   *   - `news_social_concern`
   *   - `other_hobbies`
   *   - `relationships`
   *   - `science_technology`
   *   - `sports`
   *   - `travel_adventure`
   *   - `youth_student_life`
   * - `sentiment` - include the following labels
   *
   *   - `positive`
   *   - `neutral`
   *   - `negative`
   * - `emotion` - include the following labels
   *
   *   - `anger`
   *   - `anticipation`
   *   - `disgust`
   *   - `fear`
   *   - `joy`
   *   - `love`
   *   - `optimism`
   *   - `pessimism`
   *   - `sadness`
   *   - `surprise`
   *   - `trust`
   * - `moderation` - include the following labels
   *
   *   - `llm_generated`
   *   - `spam`
   *   - `sexual`
   *   - `hate`
   *   - `violence`
   *   - `harassment`
   *   - `self_harm`
   *   - `sexual_minors`
   *   - `hate_threatening`
   *   - `violence_graphic`
   */
export * as LabelsForText from "./types/LabelsForText.js"

/**
   * The category of labels to retrieve.
   *
   * Available values for label_category: `topics`, `sentiment`, `emotion`, `moderation`, `all`
   *
   * - `topics` - include the following labels
   *
   *   - `arts_culture`
   *   - `business_entrepreneurs`
   *   - `celebrity_pop_culture`
   *   - `diaries_daily_life`
   *   - `family`
   *   - `fashion_style`
   *   - `film_tv_video`
   *   - `fitness_health`
   *   - `food_dining`
   *   - `gaming`
   *   - `learning_educational`
   *   - `music`
   *   - `news_social_concern`
   *   - `other_hobbies`
   *   - `relationships`
   *   - `science_technology`
   *   - `sports`
   *   - `travel_adventure`
   *   - `youth_student_life`
   * - `sentiment` - include the following labels
   *
   *   - `positive`
   *   - `neutral`
   *   - `negative`
   * - `emotion` - include the following labels
   *
   *   - `anger`
   *   - `anticipation`
   *   - `disgust`
   *   - `fear`
   *   - `joy`
   *   - `love`
   *   - `optimism`
   *   - `pessimism`
   *   - `sadness`
   *   - `surprise`
   *   - `trust`
   * - `moderation` - include the following labels
   *
   *   - `llm_generated`
   *   - `spam`
   *   - `sexual`
   *   - `hate`
   *   - `violence`
   *   - `harassment`
   *   - `self_harm`
   *   - `sexual_minors`
   *   - `hate_threatening`
   *   - `violence_graphic`
   * - `all` - include all labels above
   */
export * as LabelsForUsers from "./types/LabelsForUsers.js"

/**
   * The label to retrieve top scored casts for
   *
   * Available values:
   *
   * Labels in `topics` category
   *
   * - `arts_culture`
   * - `business_entrepreneurs`
   * - `celebrity_pop_culture`
   * - `diaries_daily_life`
   * - `family`
   * - `fashion_style`
   * - `film_tv_video`
   * - `fitness_health`
   * - `food_dining`
   * - `gaming`
   * - `learning_educational`
   * - `music`
   * - `news_social_concern`
   * - `other_hobbies`
   * - `relationships`
   * - `science_technology`
   * - `sports`
   * - `travel_adventure`
   * - `youth_student_life`
   *
   * Labels in `sentiment` category
   *
   * - `positive`
   * - `neutral`
   * - `negative`
   *
   * Labels in `emotion` category
   *
   * - `anger`
   * - `anticipation`
   * - `disgust`
   * - `fear`
   * - `joy`
   * - `love`
   * - `optimism`
   * - `pessimism`
   * - `sadness`
   * - `surprise`
   * - `trust`
   *
   * Labels in `moderation` category
   *
   * - `llm_generated`
   * - `spam`
   * - `sexual`
   * - `hate`
   * - `violence`
   * - `harassment`
   * - `self_harm`
   * - `sexual_minors`
   * - `hate_threatening`
   * - `violence_graphic`
   */
export * as LabelsTopItems from "./types/LabelsTopItems.js"

/**
   * The label to retrieve top scored users for
   *
   * Available values:
   *
   * Labels in `topics` category
   *
   * - `arts_culture`
   * - `business_entrepreneurs`
   * - `celebrity_pop_culture`
   * - `diaries_daily_life`
   * - `family`
   * - `fashion_style`
   * - `film_tv_video`
   * - `fitness_health`
   * - `food_dining`
   * - `gaming`
   * - `learning_educational`
   * - `music`
   * - `news_social_concern`
   * - `other_hobbies`
   * - `relationships`
   * - `science_technology`
   * - `sports`
   * - `travel_adventure`
   * - `youth_student_life`
   *
   * Labels in `sentiment` category
   *
   * - `positive`
   * - `neutral`
   * - `negative`
   *
   * Labels in `emotion` category
   *
   * - `anger`
   * - `anticipation`
   * - `disgust`
   * - `fear`
   * - `joy`
   * - `love`
   * - `optimism`
   * - `pessimism`
   * - `sadness`
   * - `surprise`
   * - `trust`
   *
   * Labels in `moderation` category
   *
   * - `llm_generated`
   * - `spam`
   * - `sexual`
   * - `hate`
   * - `violence`
   * - `harassment`
   * - `self_harm`
   * - `sexual_minors`
   * - `hate_threatening`
   * - `violence_graphic`
   */
export * as LabelsTopUsers from "./types/LabelsTopUsers.js"

/**
 * Define another set of filters for promotional content that will be be inserted in the resulting
 * feed (currently only 1 promotion filter is supported)
 *
 * Two types of promotions are supported: 1) `feed` and 2) `items`. This is specified by the
 * `promotion_type` parameter.
 *
 * 1. `feed` promotion uses either the supplied filter or a `feed_id` to retrieve a "promotional" list
 *    of items to be inserted into the main feed. `percent` can be used to control the ratio of
 *    items from main feed and promotion feed
 * 2. `items` promotion lets you specify a list of specific items to be inserted at specific locations
 *    (`rank`) in the response
 */
export * as PromotionFiltersParam from "./types/PromotionFiltersParam.js"

/**
 * The type of algorithm to use for ranking - ie how to personalize the feed for the current user_id
 * and decide what to show the user first
 *
 * In the following description:
 *
 * - User interest is inferred from the user's past interaction with different types of content
 * - Affinity is based on the user's following graph
 *
 * Available values:
 *
 * - `balanced_feed_v0.0.1` - balanced mix of interest and affinity based scoring (this is the
 *   default)
 * - `balanced_feed_interest_bias_v0.0.1` - balanced mix of interest and affinity based scoring, with
 *   a bias towards interest-based scoring
 * - `balanced_feed_affinity_bias_v0.0.1` - balanced mix of interest and affinity based scoring, with
 *   a bias towards affinity-based scoring
 * - `user_affinity_all_following_v0.0.1` - recommend items for user based on all of the user's
 *   followings
 * - `user_affinity_closest_following_v0.0.1` - recommend items for user based on their followings,
 *   with "closer" users (more frequent interaction) ranked higher
 * - `user_interest_all_v0.0.1` - recommend items for user based on user interests, inferred from all
 *   past interactions
 * - `user_interest_recent_v0.0.1` - recommend items for user based on user interests, inferred from
 *   past interactions with a recency bias
 */
export * as ScoringParam from "./types/ScoringParam.js"

/**
   * Whether to include AI labels in search results (note that only we officially only support
   * English content for AI labels at the moment)
   */
export * as SemanticSearch from "./types/SemanticSearch.js"

/**
   * Maximum number of casts to return (max 50 if return_ai_labels or return_metatdata is set to
   * true)
   */
export * as Similar from "./types/Similar.js"

/**
 * Topic for fetching users feed
 *
 * Available Values:
 *
 * - `arts_culture`
 * - `business_entrepreneurs`
 * - `celebrity_pop_culture`
 * - `diaries_daily_life`
 * - `family`
 * - `fashion_style`
 * - `film_tv_video`
 * - `fitness_health`
 * - `food_dining`
 * - `gaming`
 * - `learning_educational`
 * - `music`
 * - `news_social_concern`
 * - `other_hobbies`
 * - `relationships`
 * - `science_technology`
 * - `sports`
 * - `travel_adventure`
 * - `youth_student_life`
 */
export * as TopicParam from "./types/TopicParam.js"

/**
   * Channel url for fetching users feed
   *
   * You can get farcaster channels list from [here](https://api.warpcast.com/v2/all-channels).
   */
export * as UsersFeedForChannel from "./types/UsersFeedForChannel.js"

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
export * as UsersFeedForItem from "./types/UsersFeedForItem.js"

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
export * as UsersFeedForTopic from "./types/UsersFeedForTopic.js"


export * as UsersFeedSimilar from "./types/UsersFeedSimilar.js"


export * as UsersSemanticSearch from "./types/UsersSemanticSearch.js"

/**
   * Fid of user viewing the feed
   *
   * In `top_k` mode, if a non-zero `impression_count` is specified, the API treats the top
   * `impression_count` items returned in this API call as seen by this user, and will not return
   * the same items in the next API call.
   *
   * NOTE:
   *
   * - Wallet_address is ignored if user_id is specified
   */
export * as popular from "./types/popular.js"

/**
   * Fid of user viewing the feed
   *
   * In `top_k` mode, if a non-zero `impression_count` is specified, the API treats the top
   * `impression_count` items returned in this API call as seen by this user, and will not return
   * the same items in the next API call.
   *
   * NOTE:
   *
   * - Wallet_address is ignored if user_id is specified
   */
export * as trendingNow from "./types/trendingNow.js"
