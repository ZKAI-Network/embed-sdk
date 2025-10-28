import type {
  CreateDatasourceApiResponse,
  CreateDatasourceRequest,
  CreateDatasourceResponse,
  IngestionApiResponse,
  IngestionResponse,
  Interaction,
  Item,
  User
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"

/**
 * Create a new datasource with automatic Embed stream provisioning
 *
 * @param http - HTTP client for making API requests
 * @param options - Optional datasource creation parameters
 * @returns Promise<CreateDatasourceResponse> - The created datasource details
 *
 * @example
 * ```typescript
 * // Create datasource with name
 * const datasource = await createDatasource(http, { name: "my-web3-app" })
 * console.log(datasource.datasource_id) // "datasource-e07d2ec0-643a"
 *
 * // Create datasource without name
 * const datasource = await createDatasource(http)
 * ```
 */
export async function createDatasource(
  http: IHttpClient,
  options?: CreateDatasourceRequest
): Promise<CreateDatasourceResponse> {
  const response = await http.post<CreateDatasourceApiResponse>("/v3/datasources", options)
  return response.body
}

/**
 * Ingest content items (posts, articles, videos, etc.) from various protocols
 *
 * @param http - HTTP client for making API requests
 * @param datasourceId - The datasource identifier
 * @param items - Single item or array of items to ingest
 * @returns Promise<IngestionResponse> - Ingestion result with stream details
 *
 * @example
 * ```typescript
 * // Ingest single item
 * const response = await ingestItems(http, "datasource-e07d2ec0-643a", {
 *   item_id: "farcaster.0xabc123",
 *   protocol: "farcaster",
 *   author_id: "farcaster.alice123",
 *   created_at: "2024-01-15T10:30:00Z",
 *   updated_at: "2024-01-15T10:30:00Z",
 *   publication_type: "frame",
 *   root_item_id: "farcaster.0xabc123",
 *   language_score: 0.95,
 *   title: "My Farcaster Frame"
 * })
 *
 * // Ingest multiple items
 * const response = await ingestItems(http, "datasource-e07d2ec0-643a", [item1, item2])
 * console.log(response.total_records) // 2
 * ```
 */
export async function ingestItems(
  http: IHttpClient,
  datasourceId: string,
  items: Item | Array<Item>
): Promise<IngestionResponse> {
  const response = await http.post<IngestionApiResponse>(`/v3/datasources/${datasourceId}/items`, items)
  return response.body
}

/**
 * Ingest user profile data from various protocols
 *
 * @param http - HTTP client for making API requests
 * @param datasourceId - The datasource identifier
 * @param users - Single user or array of users to ingest
 * @returns Promise<IngestionResponse> - Ingestion result with stream details
 *
 * @example
 * ```typescript
 * // Ingest single user
 * const response = await ingestUsers(http, "datasource-e07d2ec0-643a", {
 *   user_id: "farcaster.alice123",
 *   protocol: "farcaster",
 *   created_at: "2024-01-15T10:30:00Z",
 *   updated_at: "2024-01-15T10:30:00Z",
 *   username: "alice",
 *   display_name: "Alice Cooper",
 *   bio: "Web3 developer and content creator"
 * })
 *
 * // Ingest multiple users
 * const response = await ingestUsers(http, "datasource-e07d2ec0-643a", [user1, user2])
 * console.log(response.successful_records) // 2
 * ```
 */
export async function ingestUsers(
  http: IHttpClient,
  datasourceId: string,
  users: User | Array<User>
): Promise<IngestionResponse> {
  const response = await http.post<IngestionApiResponse>(`/v3/datasources/${datasourceId}/users`, users)
  return response.body
}

/**
 * Track user interactions with content items
 *
 * @param http - HTTP client for making API requests
 * @param datasourceId - The datasource identifier
 * @param interactions - Single interaction or array of interactions to track
 * @returns Promise<IngestionResponse> - Tracking result with stream details
 *
 * @example
 * ```typescript
 * // Track single interaction
 * const response = await trackItemInteractions(http, "datasource-e07d2ec0-643a", {
 *   item_id: "farcaster.0xabc123",
 *   timestamp: 1705312200,
 *   event_type: "like",
 *   user_id: "farcaster.alice123"
 * })
 *
 * // Track multiple interactions
 * const interactions = [
 *   {
 *     item_id: "farcaster.0x111",
 *     timestamp: 1705312200,
 *     event_type: "view",
 *     user_id: "farcaster.user1"
 *   },
 *   {
 *     item_id: "lens.post222",
 *     timestamp: 1705312300,
 *     event_type: "like",
 *     session_id: "sess_web_789"
 *   }
 * ]
 * const response = await trackItemInteractions(http, "datasource-e07d2ec0-643a", interactions)
 * ```
 */
export async function trackItemInteractions(
  http: IHttpClient,
  datasourceId: string,
  interactions: Interaction | Array<Interaction>
): Promise<IngestionResponse> {
  const response = await http.post<IngestionApiResponse>(
    `/v3/datasources/${datasourceId}/items/interactions`,
    interactions
  )
  return response.body
}

/**
 * Track user interactions (routed to different stream than item interactions)
 *
 * @param http - HTTP client for making API requests
 * @param datasourceId - The datasource identifier
 * @param interactions - Single interaction or array of interactions to track
 * @returns Promise<IngestionResponse> - Tracking result with stream details
 *
 * @example
 * ```typescript
 * // Track user interaction
 * const response = await trackUserInteractions(http, "datasource-e07d2ec0-643a", {
 *   item_id: "farcaster.0xabc123",
 *   timestamp: 1705312200,
 *   event_type: "like",
 *   user_id: "farcaster.alice123"
 * })
 * ```
 */
export async function trackUserInteractions(
  http: IHttpClient,
  datasourceId: string,
  interactions: Interaction | Array<Interaction>
): Promise<IngestionResponse> {
  const response = await http.post<IngestionApiResponse>(
    `/v3/datasources/${datasourceId}/users/interactions`,
    interactions
  )
  return response.body
}
