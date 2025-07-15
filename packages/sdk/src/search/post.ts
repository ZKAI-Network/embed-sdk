import type {
  LabelCategories,
  LabelsForItems,
  PostLabelsResponse,
  PostSemanticSearchResponse,
  SemanticSearch
} from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"

export type PostLabelsOptions = Omit<LabelsForItems, "items_list" | "label_category">
export type PostSemanticSearchOptions = Omit<SemanticSearch, "query">

/**
 * Get AI labels for a list of casts
 *
 * @param httpClient - HTTP client instance
 * @param itemsList - Array of cast IDs to get labels for
 * @param labelCategory - The category of labels to retrieve (default: "all")
 * @param options - Optional configuration
 * @returns Promise<PostLabelsResponse> - Array of casts with their AI labels
 *
 * @example
 * ```typescript
 * const postLabels = await client.search.posts.getLabels([
 *   "0x4888649440c8cfd3ef6e28f2096a201d20253176",
 *   "0x0ecf95b73aa54d583877821ece241e94de701404"
 * ], "moderation")
 * console.log(postLabels[0].moderation[0].label) // "sexual"
 * console.log(postLabels[0].moderation[0].score) // 0.0006675918
 * ```
 */
export async function getLabels(
  httpClient: IHttpClient,
  itemsList: Array<string>,
  labelCategory: LabelCategories = "all",
  options?: PostLabelsOptions
): Promise<PostLabelsResponse> {
  const params: LabelsForItems = {
    items_list: itemsList,
    label_category: labelCategory,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: PostLabelsResponse
  }>("/v2/farcaster/casts/labels/for-items", params)

  return response.body
}

/**
 * Search for casts by semantic query
 *
 * @param httpClient - HTTP client instance
 * @param query - The text query to search for similar casts
 * @param options - Optional configuration with top_k (default: 10, max: 100), return_ai_labels, return_metadata, and filters
 * @returns Promise<PostSemanticSearchResponse> - Object with items_list containing cast IDs and scores
 *
 * @example
 * ```typescript
 * const posts = await client.search.posts.byQuery("web3 developments", {
 *   top_k: 10,
 *   return_ai_labels: true,
 *   return_metadata: true
 * })
 * console.log(posts.items_list[0].item_id) // "0x4c8e2e329dc481f4c445ff8c367a1df4a8694317"
 * console.log(posts.items_list[0].score) // 0.864244163
 * ```
 */
export async function byQuery(
  httpClient: IHttpClient,
  query: string,
  options?: PostSemanticSearchOptions
): Promise<PostSemanticSearchResponse> {
  const top_k = options?.top_k ?? 10

  const params: SemanticSearch = {
    query,
    top_k,
    ...options
  }

  const response = await httpClient.post<{
    status_code: number
    body: PostSemanticSearchResponse | { items_list: PostSemanticSearchResponse }
  }>("/v2/farcaster/casts/search/semantic", params)

  // Handle both response formats - sometimes it's a direct array, sometimes it's wrapped in items_list
  if (Array.isArray(response.body)) {
    return response.body
  } else {
    return (response.body as { items_list: PostSemanticSearchResponse }).items_list
  }
}
