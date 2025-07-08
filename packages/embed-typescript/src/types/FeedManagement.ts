/**
 * Feed configuration filters
 */
export interface FeedFilters {
  channels?: Array<string>
  app_fids?: Array<string>
  geo_locations?: Array<string>
  remove_geo_locations?: Array<string>
  ai_labels?: Array<string>
  publication_types?: Array<string>
  remove_ai_labels?: Array<string>
  author_ids?: Array<string>
  remove_author_ids?: Array<string>
  embed_domains?: Array<string>
  start_timestamp?: string
}

/**
 * Feed configuration
 */
export interface FeedConfig {
  filters: FeedFilters
  return_global_fallback?: boolean
  scoring?: string
}

/**
 * Feed configuration object for creating/updating feeds
 */
export interface FeedConfiguration {
  config_id?: string
  name: string
  description: string
  endpoint: string
  status: "active" | "inactive"
  visibility: "private" | "public"
  config: FeedConfig
  feed_image_url?: string | undefined
  short_name?: string | null | undefined
}

/**
 * Response from feed creation/update operations
 */
export interface FeedConfigurationResponse {
  config_id: string
  name: string
  description: string
  endpoint: string
  status: "active" | "inactive"
  visibility: "private" | "public"
  config: FeedConfig
  feed_image_url?: string
  short_name?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Request payload for listing feeds
 */
export interface ListFeedsRequest {
  visibility: "private" | "public"
}

/**
 * Response from feed listing operation
 */
export interface ListFeedsResponse {
  feeds: Array<FeedConfigurationResponse>
}

/**
 * Options for creating a new feed
 */
export interface CreateFeedOptions {
  name: string
  description: string
  endpoint?: string
  status?: "active" | "inactive"
  visibility?: "private" | "public"
  config?: Partial<FeedConfig>
  feed_image_url?: string
  short_name?: string | null
}

/**
 * Options for updating an existing feed
 */
export interface UpdateFeedOptions extends Partial<CreateFeedOptions> {
  config_id: string
}
