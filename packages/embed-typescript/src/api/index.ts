// Import all API methods
import { get, post } from "./common/http.js"
import { ForYou, Popular, Trending } from "./farcaster/casts/feed/index.js"
import { Search } from "./farcaster/casts/search/index.js"

/**
 * API client with specific endpoint methods
 */
export const EmbedApi = {
  /**
   * Get the "for you" feed from Farcaster casts
   */
  ForYou,

  /**
   * Get trending casts
   */
  Trending,

  /**
   * Get popular casts
   */
  Popular,

  /**
   * Semantic search for casts
   */
  Search,

  /**
   * Generic POST request to any embed API endpoint
   */
  post,

  /**
   * Generic GET request to any embed API endpoint
   */
  get
}

// Re-export individual methods for direct import
export { ForYou, get, Popular, post, Search, Trending }
