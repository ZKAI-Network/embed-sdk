import type {
  AllLabels,
  LabelCategories,
  LabelsForUsers,
  LabelsTopUsers,
  UserLabelsResponse,
  UserSemanticSearchResponse,
  UsersFeedSimilar,
  UserSimilarityResponse,
  UsersSemanticSearch,
  UserTopByLabelResponse
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"

export type UserSimilarOptions = Omit<UsersFeedSimilar, "user_id">
export type UserSemanticSearchOptions = Omit<UsersSemanticSearch, "query">
export type UserTopByLabelOptions = Omit<LabelsTopUsers, "label">
export type UserLabelsOptions = Omit<LabelsForUsers, "users_list" | "label_category">

/**
 * Get similar users for a given user ID
 *
 * @param httpClient - HTTP client instance
 * @param userId - The user ID (fid) to find similar users for
 * @param options - Optional configuration with top_k parameter
 * @returns Promise<UserSimilarityResponse> - Array of similar users with scores
 *
 * @example
 * ```typescript
 * const similarUsers = await client.search.users.similar("16085", { top_k: 10 })
 * console.log(similarUsers[0].user_id) // "3"
 * console.log(similarUsers[0].score) // 0.931880295
 * ```
 */
export async function similar(
  httpClient: IHttpClient,
  userId: string,
  options?: UserSimilarOptions
): Promise<UserSimilarityResponse> {
  const top_k = options?.top_k ?? 25

  const params: UsersFeedSimilar = {
    user_id: userId,
    top_k,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: UserSimilarityResponse
  }>("/v2/farcaster/users/feed/similar", params)

  return response.body
}

/**
 * Search for users by semantic query
 *
 * @param httpClient - HTTP client instance
 * @param query - The text query to search for similar users
 * @param options - Optional configuration with top_k parameter
 * @returns Promise<UserSemanticSearchResponse> - Array of users matching the query with scores
 *
 * @example
 * ```typescript
 * const users = await client.search.users.byQuery("web3 developers", { top_k: 10 })
 * console.log(users[0].user_id) // "444746"
 * console.log(users[0].score) // 0.697465777
 * ```
 */
export async function byQuery(
  httpClient: IHttpClient,
  query: string,
  options?: UserSemanticSearchOptions
): Promise<UserSemanticSearchResponse> {
  const top_k = options?.top_k ?? 25

  const params: UsersSemanticSearch = {
    query,
    top_k,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: UserSemanticSearchResponse
  }>("/v2/farcaster/users/search/semantic", params)

  return response.body
}

/**
 * Get top users by AI label
 *
 * @param httpClient - HTTP client instance
 * @param label - The AI label to get top users for
 * @param options - Optional configuration including top_k, minimum_activity_count, ratio_min, conf_min
 * @returns Promise<UserTopByLabelResponse> - Array of top users for the label with scores, counts, and ratios
 *
 * @example
 * ```typescript
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
export async function getTopByLabel(
  httpClient: IHttpClient,
  label: AllLabels,
  options?: UserTopByLabelOptions
): Promise<UserTopByLabelResponse> {
  const top_k = options?.top_k ?? 100
  const minimum_activity_count = options?.minimum_activity_count ?? 10
  const ratio_min = options?.ratio_min ?? 0.75
  const conf_min = options?.conf_min ?? 0.6

  const params: LabelsTopUsers = {
    label,
    top_k,
    minimum_activity_count,
    ratio_min,
    conf_min,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: UserTopByLabelResponse
  }>("/v2/farcaster/users/labels/top-users", params)

  return response.body
}

/**
 * Get AI labels for a list of users
 *
 * @param httpClient - HTTP client instance
 * @param userList - Array of user IDs to get labels for
 * @param labelCategory - The category of labels to retrieve (default: "all")
 * @param options - Optional configuration
 * @returns Promise<UserLabelsResponse> - Array of users with their AI labels
 *
 * @example
 * ```typescript
 * const userLabels = await client.search.users.getLabels(["16085", "239", "3"], "topics")
 * console.log(userLabels[0].user_id) // "16085"
 * console.log(userLabels[0].ai_labels.topics[0].label) // "arts_culture"
 * console.log(userLabels[0].ai_labels.topics[0].score) // 0.023266956986850353
 * ```
 */
export async function getLabels(
  httpClient: IHttpClient,
  userList: Array<string>,
  labelCategory: LabelCategories = "all",
  options?: UserLabelsOptions
): Promise<UserLabelsResponse> {
  const params: LabelsForUsers = {
    users_list: userList,
    label_category: labelCategory,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: UserLabelsResponse
  }>("/v2/farcaster/users/labels/for-users", params)

  return response.body
}
