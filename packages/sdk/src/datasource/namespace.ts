import type {
  CreateDatasourceRequest,
  CreateDatasourceResponse,
  IngestionResponse,
  Interaction,
  Item,
  User
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"
import {
  createDatasource,
  ingestItems,
  ingestUsers,
  trackItemInteractions,
  trackUserInteractions
} from "./datasource.js"

/**
 * Datasource namespace containing all datasource-related operations for managing
 * datasources and ingesting structured data from web3 and social media protocols
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key')
 *
 * // Create a new datasource
 * const datasource = await client.datasource.create({ name: "my-web3-app" })
 *
 * // Ingest content items
 * await client.datasource.ingestItems(datasource.datasource_id, items)
 *
 * // Track user interactions
 * await client.datasource.trackItemInteractions(datasource.datasource_id, interactions)
 * ```
 */
export class DatasourceNamespace {
  constructor(private http: IHttpClient) {}

  // ============================================================================
  // DATASOURCE MANAGEMENT METHODS
  // ============================================================================

  /**
   * Create a new datasource with automatic Embed stream provisioning
   *
   * @param options - Optional datasource creation parameters
   * @returns Promise<CreateDatasourceResponse> - The created datasource details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   *
   * // Create datasource with name
   * const datasource = await client.datasource.create({ name: "my-web3-app" })
   * console.log(datasource.datasource_id) // "datasource-e07d2ec0-643a"
   * console.log(datasource.status) // "provisioning"
   *
   * // Create datasource without name (auto-generated)
   * const datasource = await client.datasource.create()
   * ```
   */
  async create(options?: CreateDatasourceRequest): Promise<CreateDatasourceResponse> {
    return createDatasource(this.http, options)
  }

  // ============================================================================
  // DATA INGESTION METHODS
  // ============================================================================

  /**
   * Ingest content items (posts, articles, videos, etc.) from various protocols
   *
   * @param datasourceId - The datasource identifier
   * @param items - Single item or array of items to ingest
   * @returns Promise<IngestionResponse> - Ingestion result with stream details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const datasourceId = "datasource-e07d2ec0-643a"
   *
   * // Ingest single item
   * const response = await client.datasource.ingestItems(datasourceId, {
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
   * console.log(response.message) // "Data ingested successfully"
   *
   * // Ingest multiple items at once
   * const items = [item1, item2, item3]
   * const response = await client.datasource.ingestItems(datasourceId, items)
   * console.log(response.total_records) // 3
   * console.log(response.successful_records) // 3
   * ```
   */
  async ingestItems(
    datasourceId: string,
    items: Item | Array<Item>
  ): Promise<IngestionResponse> {
    return ingestItems(this.http, datasourceId, items)
  }

  /**
   * Ingest user profile data from various protocols
   *
   * @param datasourceId - The datasource identifier
   * @param users - Single user or array of users to ingest
   * @returns Promise<IngestionResponse> - Ingestion result with stream details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const datasourceId = "datasource-e07d2ec0-643a"
   *
   * // Ingest single user
   * const response = await client.datasource.ingestUsers(datasourceId, {
   *   user_id: "farcaster.alice123",
   *   protocol: "farcaster",
   *   created_at: "2024-01-15T10:30:00Z",
   *   updated_at: "2024-01-15T10:30:00Z",
   *   username: "alice",
   *   display_name: "Alice Cooper",
   *   bio: "Web3 developer and content creator"
   * })
   * console.log(response.stream_name) // "datasource-e07d2ec0-643a.users"
   *
   * // Ingest multiple users at once
   * const users = [user1, user2, user3]
   * const response = await client.datasource.ingestUsers(datasourceId, users)
   * console.log(response.successful_records) // 3
   * ```
   */
  async ingestUsers(
    datasourceId: string,
    users: User | Array<User>
  ): Promise<IngestionResponse> {
    return ingestUsers(this.http, datasourceId, users)
  }

  // ============================================================================
  // INTERACTION TRACKING METHODS
  // ============================================================================

  /**
   * Track user interactions with content items
   *
   * @param datasourceId - The datasource identifier
   * @param interactions - Single interaction or array of interactions to track
   * @returns Promise<IngestionResponse> - Tracking result with stream details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const datasourceId = "datasource-e07d2ec0-643a"
   *
   * // Track single user interaction
   * const response = await client.datasource.trackItemInteractions(datasourceId, {
   *   item_id: "farcaster.0xabc123",
   *   timestamp: 1705312200,
   *   event_type: "like",
   *   user_id: "farcaster.alice123"
   * })
   *
   * // Track anonymous interaction
   * const response = await client.datasource.trackItemInteractions(datasourceId, {
   *   item_id: "lens.post456",
   *   timestamp: 1705312800,
   *   event_type: "view",
   *   session_id: "sess_anonymous_xyz789"
   * })
   *
   * // Track multiple interactions at once
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
   * const response = await client.datasource.trackItemInteractions(datasourceId, interactions)
   * console.log(response.total_records) // 2
   * ```
   */
  async trackItemInteractions(
    datasourceId: string,
    interactions: Interaction | Array<Interaction>
  ): Promise<IngestionResponse> {
    return trackItemInteractions(this.http, datasourceId, interactions)
  }

  /**
   * Track user interactions (routed to different stream than item interactions)
   *
   * @param datasourceId - The datasource identifier
   * @param interactions - Single interaction or array of interactions to track
   * @returns Promise<IngestionResponse> - Tracking result with stream details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const datasourceId = "datasource-e07d2ec0-643a"
   *
   * // Track user interaction (same schema as item interactions but different stream)
   * const response = await client.datasource.trackUserInteractions(datasourceId, {
   *   item_id: "farcaster.0xabc123",
   *   timestamp: 1705312200,
   *   event_type: "like",
   *   user_id: "farcaster.alice123"
   * })
   * console.log(response.stream_name) // Different stream routing than trackItemInteractions
   * ```
   */
  async trackUserInteractions(
    datasourceId: string,
    interactions: Interaction | Array<Interaction>
  ): Promise<IngestionResponse> {
    return trackUserInteractions(this.http, datasourceId, interactions)
  }
}
