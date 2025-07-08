import type { IHttpClient } from "../interfaces/index.js"
import type {
  CreateFeedOptions,
  FeedConfiguration,
  FeedConfigurationResponse,
  ListFeedsRequest,
  ListFeedsResponse,
  UpdateFeedOptions
} from "../types/FeedManagement.js"

const CONSOLE_API_BASE_URL = "https://console-api-us-west-2.mbd.xyz"

/**
 * Create a new feed configuration
 */
export async function createFeed(
  httpClient: IHttpClient,
  options: CreateFeedOptions
): Promise<FeedConfigurationResponse> {
  const feedConfig: FeedConfiguration = {
    name: options.name,
    description: options.description,
    endpoint: options.endpoint ?? "casts/feed/for-you",
    status: options.status ?? "active",
    visibility: options.visibility ?? "private",
    config: {
      filters: {
        channels: [],
        app_fids: [],
        geo_locations: [],
        remove_geo_locations: [],
        ai_labels: [],
        publication_types: [],
        remove_ai_labels: [],
        author_ids: [],
        remove_author_ids: [],
        embed_domains: [],
        start_timestamp: "days_ago:7"
      },
      return_global_fallback: true,
      scoring: "all",
      ...options.config
    },
    feed_image_url: options.feed_image_url,
    short_name: options.short_name ?? null
  }

  return httpClient.requestWithCustomBaseUrl<FeedConfigurationResponse>(
    "POST",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    feedConfig
  )
}

/**
 * Retrieve a feed configuration by ID
 */
export async function getFeed(
  httpClient: IHttpClient,
  configId: string
): Promise<FeedConfigurationResponse> {
  return httpClient.requestWithCustomBaseUrl<FeedConfigurationResponse>(
    "GET",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    undefined,
    { config_id: configId }
  )
}

/**
 * List all feed configurations for the account
 */
export async function listFeeds(
  httpClient: IHttpClient,
  visibility: "private" | "public" = "private"
): Promise<ListFeedsResponse> {
  const request: ListFeedsRequest = { visibility }

  return httpClient.requestWithCustomBaseUrl<ListFeedsResponse>(
    "POST",
    CONSOLE_API_BASE_URL,
    "/api/feed/configs",
    request
  )
}

/**
 * Update an existing feed configuration
 */
export async function updateFeed(
  httpClient: IHttpClient,
  options: UpdateFeedOptions
): Promise<FeedConfigurationResponse> {
  // First get the current feed configuration
  const currentFeed = await getFeed(httpClient, options.config_id)

  // Merge the current configuration with the updates
  const updatedConfig: FeedConfiguration = {
    ...currentFeed,
    ...options,
    config: {
      ...currentFeed.config,
      ...options.config
    }
  }

  return httpClient.requestWithCustomBaseUrl<FeedConfigurationResponse>(
    "PATCH",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    updatedConfig
  )
}
