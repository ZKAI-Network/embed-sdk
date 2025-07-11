import type {
  CreateFeedOptions,
  FeedCreateUpdateResponse,
  FeedGetResponse,
  ForYouResponse,
  ListFeedsResponse,
  UpdateFeedOptions
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"
import { byUserId, byWalletAddress } from "./feed.js"
import type { FeedOptions } from "./feed.js"
import { createConfig, getConfig, listConfigs, updateConfig } from "./management.js"

/**
 * Feed namespace containing all feed-related operations
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key')
 *
 * // Get personalized feed
 * const feed = await client.feed.byUserId('16085')
 *
 * // Create a custom feed
 * const customFeed = await client.feed.createConfig({
 *   name: 'My Custom Feed',
 *   description: 'A feed for my app'
 * })
 * ```
 */
export class FeedNamespace {
  constructor(private http: IHttpClient) {}

  // ============================================================================
  // FEED GATHERING METHODS
  // ============================================================================

  /**
   * Get personalized "For You" feed by user ID
   *
   * @param userId - The Farcaster user ID to get personalized feed for
   * @param options - Optional configuration for feed generation
   * @returns Promise<ForYouFeedItem[]> - Array of personalized feed items
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const feed = await client.feed.byUserId("16085", {
   *   top_k: 10,
   *   return_metadata: true
   * })
   * console.log(feed[0].metadata?.text) // Access cast text
   * console.log(feed[0].metadata?.author.username) // Access author username
   * ```
   */
  async byUserId(
    userId: string,
    options?: FeedOptions
  ): Promise<ForYouResponse> {
    return byUserId(this.http, userId, options)
  }

  /**
   * Get personalized "For You" feed by wallet address
   *
   * @param walletAddress - The user's wallet address to get personalized feed for
   * @param options - Optional configuration for feed generation
   * @returns Promise<ForYouFeedItem[]> - Array of personalized feed items
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const feed = await client.feed.byWalletAddress("0x1234...", {
   *   top_k: 15,
   * })
   * console.log(feed[0].metadata?.author.username) // Access author username
   * console.log(feed[0].score) // Access recommendation score
   * ```
   */
  async byWalletAddress(
    walletAddress: string,
    options?: FeedOptions
  ): Promise<ForYouResponse> {
    return byWalletAddress(this.http, walletAddress, options)
  }

  // ============================================================================
  // FEED MANAGEMENT METHODS
  // ============================================================================

  /**
   * Create a new feed configuration
   *
   * @param options - Feed creation options including name, description, and configuration
   * @returns Promise<FeedConfigurationResponse> - The created feed configuration
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const feed = await client.feed.createConfig({
   *   name: "My Custom Feed",
   *   description: "A personalized feed for my app",
   *   visibility: "private",
   *   config: {
   *     filters: {
   *       ai_labels: ["web3_nft", "web3_defi"],
   *       start_timestamp: "days_ago:7"
   *     }
   *   }
   * })
   * console.log(feed.config_id) // Access the feed ID
   * ```
   */
  async createConfig(options: CreateFeedOptions): Promise<FeedCreateUpdateResponse> {
    return createConfig(this.http, options)
  }

  /**
   * Get a feed configuration by ID
   *
   * @param configId - The feed configuration ID
   * @returns Promise<FeedConfigurationResponse> - The feed configuration details
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const feed = await client.feed.getConfig("feed_123")
   * console.log(feed.name) // Access feed name
   * console.log(feed.config.filters) // Access feed filters
   * ```
   */
  async getConfig(configId: string): Promise<FeedGetResponse> {
    return getConfig(this.http, configId)
  }

  /**
   * List all feed configurations for the account
   *
   * @param visibility - Filter by visibility (private/template/public), defaults to "private"
   * @returns Promise<FeedConfigurationResponse[]> - Array of feed configurations
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const feeds = await client.feed.listConfigs("private")
   * console.log(`Found ${feeds.length} feeds`)
   * feeds.forEach(feed => console.log(feed.name))
   * ```
   */
  async listConfigs(visibility: "private" | "template" | "public" = "private"): Promise<ListFeedsResponse> {
    return listConfigs(this.http, visibility)
  }

  /**
   * Update an existing feed configuration
   *
   * @param options - Feed update options, must include config_id
   * @returns Promise<void> - Resolves when the feed is successfully updated
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * await client.feed.updateConfig({
   *   config_id: "feed_123",
   *   name: "Updated Feed Name",
   *   config: {
   *     filters: {
   *       ai_labels: ["web3_nft", "web3_defi", "web3_gaming"]
   *     }
   *   }
   * })
   * console.log("Feed updated successfully")
   * ```
   */
  async updateConfig(options: UpdateFeedOptions): Promise<void> {
    return updateConfig(this.http, options)
  }
}
