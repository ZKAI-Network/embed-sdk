import type { ForYouOptions } from "./casts/feed.js"
import { getForYouFeedByUserId, getForYouFeedByWalletAddress } from "./casts/feed.js"
import type { IHttpClient } from "./interfaces/index.js"
import type { ForYouResponse } from "./types-return/ForYou.js"

/**
 * Configuration for the embed API client
 */
export interface mbdClientConfig {
  readonly baseUrl?: string
  readonly token: string
  readonly referer?: string
  readonly title?: string
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  baseUrl: "https://api.mbd.xyz",
  title: "embed_sdk_typescript"
}

/**
 * Simple HTTP client for mbd API
 */
class HttpClient implements IHttpClient {
  private config: Required<mbdClientConfig>

  constructor(config: mbdClientConfig) {
    this.config = {
      baseUrl: DEFAULT_CONFIG.baseUrl,
      title: DEFAULT_CONFIG.title,
      referer: "",
      ...config
    }
  }

  /**
   * Make a POST request to the API
   */
  async post<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse> {
    const url = `${this.config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "HTTP-Referer": this.config.referer,
        "X-Title": this.config.title
      },
      body: body ? JSON.stringify(body) : null
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

/**
 * Main mbd API client - your complete SDK
 */
export class mbdClient {
  private http: HttpClient

  constructor(token?: string, options?: mbdClientConfig) {
    if (!token && !options?.token) {
      throw new Error("Token is required")
    }

    const config: mbdClientConfig = {
      token: token || options?.token || "",
      ...options
    }

    this.http = new HttpClient(config)
  }

  // ============================================================================
  // FOR YOU FEED METHODS
  // ============================================================================

  /**
   * Get personalized "For You" feed by user ID
   */
  async getForYouFeedByUserId(
    userId: string,
    options?: ForYouOptions
  ): Promise<ForYouResponse> {
    return getForYouFeedByUserId(this.http, userId, options)
  }

  /**
   * Get personalized "For You" feed by wallet address
   */
  async getForYouFeedByWalletAddress(
    walletAddress: string,
    options?: ForYouOptions
  ): Promise<ForYouResponse> {
    return getForYouFeedByWalletAddress(this.http, walletAddress, options)
  }
}

/**
 * Factory function to create client
 */
export function getClient(token?: string, options?: mbdClientConfig): mbdClient {
  return new mbdClient(token, options)
}
