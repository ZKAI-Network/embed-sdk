import type {
  AllLabels,
  LabelCategories,
  PostLabelsResponse,
  PostSemanticSearchResponse,
  UserLabelsResponse,
  UserSemanticSearchResponse,
  UserSimilarityResponse,
  UserTopByLabelResponse
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"
import { byQuery as postsByQuery, getLabels as postsGetLabels } from "./post.js"
import type { PostLabelsOptions, PostSemanticSearchOptions } from "./post.js"
import { byQuery, getLabels, getTopByLabel, similar } from "./user.js"
import type { UserLabelsOptions, UserSemanticSearchOptions, UserSimilarOptions, UserTopByLabelOptions } from "./user.js"

/**
 * Users namespace containing all user search operations
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key')
 *
 * // Find similar users
 * const similarUsers = await client.search.users.similar('16085')
 *
 * // Search users by query
 * const users = await client.search.users.byQuery('web3 developers')
 *
 * // Get top users by label
 * const topUsers = await client.search.users.getTopByLabel('science_technology')
 *
 * // Get labels for users
 * const labels = await client.search.users.getLabels(['16085', '239'])
 * ```
 */
export class UsersNamespace {
  constructor(private http: IHttpClient) {}

  /**
   * Get similar users for a given user ID
   *
   * @param userId - The user ID (fid) to find similar users for
   * @param options - Optional configuration with top_k parameter (default: 25)
   * @returns Promise<UserSimilarityResponse> - Array of similar users with scores
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const similarUsers = await client.search.users.similar("16085", { top_k: 10 })
   * console.log(similarUsers[0].user_id) // "3"
   * console.log(similarUsers[0].score) // 0.931880295
   * ```
   */
  async similar(
    userId: string,
    options?: UserSimilarOptions
  ): Promise<UserSimilarityResponse> {
    return similar(this.http, userId, options)
  }

  /**
   * Search for users by semantic query
   *
   * @param query - The text query to search for similar users
   * @param options - Optional configuration with top_k parameter (default: 25)
   * @returns Promise<UserSemanticSearchResponse> - Array of users matching the query with scores
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const users = await client.search.users.byQuery("web3 developers", { top_k: 10 })
   * console.log(users[0].user_id) // "444746"
   * console.log(users[0].score) // 0.697465777
   * ```
   */
  async byQuery(
    query: string,
    options?: UserSemanticSearchOptions
  ): Promise<UserSemanticSearchResponse> {
    return byQuery(this.http, query, options)
  }

  /**
   * Get top users by AI label
   *
   * @param label - The AI label to get top users for
   * @param options - Optional configuration including top_k (default: 100, max: 1000), minimum_activity_count (default: 10), ratio_min (default: 0.75), conf_min (default: 0.6)
   * @returns Promise<UserTopByLabelResponse> - Array of top users for the label with scores, counts, and ratios
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const topUsers = await client.search.users.getTopByLabel("science_technology", {
   *   top_k: 50,
   *   minimum_activity_count: 20,
   *   ratio_min: 0.8,
   *   conf_min: 0.7
   * })
   * console.log(topUsers[0].user_id) // "520701"
   * console.log(topUsers[0].score) // 0.9471641778666666
   * console.log(topUsers[0].count) // 12
   * console.log(topUsers[0].ratio) // 1
   * ```
   */
  async getTopByLabel(
    label: AllLabels,
    options?: UserTopByLabelOptions
  ): Promise<UserTopByLabelResponse> {
    return getTopByLabel(this.http, label, options)
  }

  /**
   * Get AI labels for a list of users
   *
   * @param userList - Array of user IDs to get labels for
   * @param labelCategory - The category of labels to retrieve (default: "all")
   * @param options - Optional configuration
   * @returns Promise<UserLabelsResponse> - Array of users with their AI labels
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const userLabels = await client.search.users.getLabels(["16085", "239", "3"], "topics")
   * console.log(userLabels[0].user_id) // "16085"
   * console.log(userLabels[0].ai_labels.topics[0].label) // "arts_culture"
   * console.log(userLabels[0].ai_labels.topics[0].score) // 0.023266956986850353
   * ```
   */
  async getLabels(
    userList: Array<string>,
    labelCategory: LabelCategories = "all",
    options?: UserLabelsOptions
  ): Promise<UserLabelsResponse> {
    return getLabels(this.http, userList, labelCategory, options)
  }
}

/**
 * Posts namespace containing all post search operations
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key')
 *
 * // Get labels for posts
 * const postLabels = await client.search.posts.getLabels(['0x123...', '0x456...'])
 *
 * // Search posts by query
 * const posts = await client.search.posts.byQuery('web3 developments')
 * ```
 */
export class PostsNamespace {
  constructor(private http: IHttpClient) {}

  /**
   * Get AI labels for a list of casts
   *
   * @param itemsList - Array of cast IDs to get labels for
   * @param labelCategory - The category of labels to retrieve (default: "all")
   * @param options - Optional configuration
   * @returns Promise<PostLabelsResponse> - Array of casts with their AI labels
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const postLabels = await client.search.posts.getLabels([
   *   "0x4888649440c8cfd3ef6e28f2096a201d20253176",
   *   "0x0ecf95b73aa54d583877821ece241e94de701404"
   * ], "moderation")
   * console.log(postLabels[0].moderation[0].label) // "sexual"
   * console.log(postLabels[0].moderation[0].score) // 0.0006675918
   * ```
   */
  async getLabels(
    itemsList: Array<string>,
    labelCategory: LabelCategories = "all",
    options?: PostLabelsOptions
  ): Promise<PostLabelsResponse> {
    return postsGetLabels(this.http, itemsList, labelCategory, options)
  }

  /**
   * Search for casts by semantic query
   *
   * @param query - The text query to search for similar casts
   * @param options - Optional configuration with top_k (default: 10, max: 100), return_ai_labels, return_metadata, and filters
   * @returns Promise<PostSemanticSearchResponse> - Array of posts with item_id and scores
   *
   * @example
   * ```typescript
   * const client = getClient("your-api-key")
   * const posts = await client.search.posts.byQuery("web3 developments", {
   *   top_k: 10,
   *   return_ai_labels: true,
   *   return_metadata: true
   * })
   * console.log(posts[0].item_id) // "0x4c8e2e329dc481f4c445ff8c367a1df4a8694317"
   * console.log(posts[0].score) // 0.864244163
   * ```
   */
  async byQuery(
    query: string,
    options?: PostSemanticSearchOptions
  ): Promise<PostSemanticSearchResponse> {
    return postsByQuery(this.http, query, options)
  }
}

/**
 * Search namespace containing all search-related operations
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key')
 *
 * // Access user search methods
 * const similarUsers = await client.search.users.similar('16085')
 * const searchResults = await client.search.users.byQuery('web3 developers')
 *
 * // Access post search methods
 * const posts = await client.search.posts.byQuery('web3 developments')
 * const postLabels = await client.search.posts.getLabels(['0x123...'])
 * ```
 */
export class SearchNamespace {
  public readonly users: UsersNamespace
  public readonly posts: PostsNamespace

  constructor(private http: IHttpClient) {
    this.users = new UsersNamespace(this.http)
    this.posts = new PostsNamespace(this.http)
  }
}
