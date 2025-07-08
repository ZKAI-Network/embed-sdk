import type { IHttpClient } from "../interfaces/index.js"
import type {
  CreateFeedOptions,
  FeedConfiguration,
  FeedCreateUpdateResponse,
  FeedGetResponse,
  ListFeedsRequest,
  ListFeedsResponse,
  UpdateFeedOptions
} from "../types/FeedManagement.js"

const CONSOLE_API_BASE_URL = "https://console-api-us-west-2.mbd.xyz"

export async function createFeedConfig(
  httpClient: IHttpClient,
  options: CreateFeedOptions
): Promise<FeedCreateUpdateResponse> {
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

  const response = await httpClient.requestWithCustomBaseUrl<{ data: FeedCreateUpdateResponse }>(
    "POST",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    feedConfig,
    undefined,
    true // Use Basic auth
  )
  return response.data
}

export async function getFeedConfig(
  httpClient: IHttpClient,
  configId: string
): Promise<FeedGetResponse> {
  const response = await httpClient.requestWithCustomBaseUrl<{ data: FeedGetResponse }>(
    "GET",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    undefined,
    { config_id: configId },
    true // Use Basic auth
  )
  return response.data
}

export async function listFeedConfigs(
  httpClient: IHttpClient,
  visibility: "private" | "public" = "private"
): Promise<ListFeedsResponse> {
  const request: ListFeedsRequest = { visibility }

  const response = await httpClient.requestWithCustomBaseUrl<{ data: ListFeedsResponse }>(
    "POST",
    CONSOLE_API_BASE_URL,
    "/api/feed/configs",
    request,
    undefined,
    true // Use Basic auth
  )
  return [...response.data]
}

export async function updateFeedConfig(
  httpClient: IHttpClient,
  options: UpdateFeedOptions
): Promise<void> {
  // First get the current feed configuration
  const currentFeed = await getFeedConfig(httpClient, options.config_id)

  const { config_id: _config_id, ...updateOptions } = options

  // Merge the current configuration with the updates
  const updatedConfig: FeedConfiguration = {
    ...currentFeed,
    ...updateOptions,
    config: {
      ...currentFeed.config,
      ...updateOptions.config
    }
  }

  await httpClient.requestWithCustomBaseUrl<{ message: string }>(
    "PATCH",
    CONSOLE_API_BASE_URL,
    "/api/feed/config",
    updatedConfig,
    undefined,
    true // Use Basic auth
  )
  // endpoint only returns a success message, not the updated feed data
  // So we don't return anything
}
