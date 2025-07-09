import { Data, Effect, pipe, Schedule } from "effect"
import { FeedNamespace } from "./feed/namespace.js"
import type { IHttpClient } from "./interfaces/index.js"

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Network-related errors (connection issues, DNS failures, etc.)
 */
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * HTTP response errors (4xx, 5xx status codes)
 */
export class HttpRequestError extends Data.TaggedError("HttpRequestError")<{
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly body?: string
}> {}

/**
 * JSON parsing errors
 */
export class ParseError extends Data.TaggedError("ParseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Timeout errors
 */
export class TimeoutError extends Data.TaggedError("TimeoutError")<{
  readonly message: string
  readonly timeoutMs: number
}> {}

/**
 * Union of all possible HTTP client errors
 */
export type HttpClientError = NetworkError | HttpRequestError | ParseError | TimeoutError

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

/**
 * Configuration for retry behavior
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key', {
 *   retry: {
 *     maxRetries: 5,
 *     initialDelay: 1000,
 *     exponentialBackoff: true,
 *     timeoutMs: 30000
 *   }
 * })
 * ```
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  readonly maxRetries?: number
  /** Initial delay between retries in milliseconds (default: 1000) */
  readonly initialDelay?: number
  /** Whether to use exponential backoff (default: true) */
  readonly exponentialBackoff?: boolean
  /** Maximum delay between retries in milliseconds (default: 10000) */
  readonly maxDelay?: number
  /** HTTP status codes that should trigger a retry (default: [500, 502, 503, 504]) */
  readonly retryableStatusCodes?: ReadonlyArray<number>
  /** Request timeout in milliseconds (default: 30000) */
  readonly timeoutMs?: number
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  exponentialBackoff: true,
  initialDelay: 1000,
  maxDelay: 10000,
  maxRetries: 3,
  retryableStatusCodes: [500, 502, 503, 504],
  timeoutMs: 30000
}

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

/**
 * Configuration for the Embed API client
 *
 * @example
 * ```typescript
 * const client = getClient('your-api-key', {
 *   title: 'my-app',
 *   retry: {
 *     maxRetries: 3,
 *     timeoutMs: 30000
 *   }
 * })
 * ```
 */
export interface mbdClientConfig {
  /** Base URL for the API (default: https://api.mbd.xyz) */
  readonly baseUrl?: string
  /** API token for authentication */
  readonly token?: string
  /** HTTP referer header value */
  readonly referer?: string
  /** Application title for tracking (default: embed_sdk_typescript) */
  readonly title?: string
  /** Retry configuration */
  readonly retry?: RetryConfig
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  baseUrl: "https://api.mbd.xyz",
  title: "embed_sdk_typescript"
}

// ============================================================================
// HTTP CLIENT IMPLEMENTATION
// ============================================================================

/**
 * Effect-based HTTP client for mbd API with proper error handling and retries
 */
class HttpClient implements IHttpClient {
  private config: Required<Omit<mbdClientConfig, "retry">> & { retry: Required<RetryConfig> }

  constructor(config: mbdClientConfig & { token: string }) {
    this.config = {
      baseUrl: config.baseUrl ?? DEFAULT_CONFIG.baseUrl,
      title: config.title ?? DEFAULT_CONFIG.title,
      referer: config.referer ?? "",
      token: config.token,
      retry: {
        ...DEFAULT_RETRY_CONFIG,
        ...config.retry
      }
    }
  }

  /**
   * Create a timeout effect that fails after the specified duration
   */
  private createTimeoutEffect(timeoutMs: number): Effect.Effect<never, TimeoutError> {
    return pipe(
      Effect.sleep(`${timeoutMs} millis`),
      Effect.flatMap(() =>
        Effect.fail(
          new TimeoutError({
            message: `Request timed out after ${timeoutMs}ms`,
            timeoutMs
          })
        )
      )
    )
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, baseUrl?: string, queryParams?: Record<string, string>): string {
    const url = `${baseUrl ?? this.config.baseUrl}${endpoint}`

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value)
      }
    }

    const queryString = searchParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  /**
   * Perform the actual fetch request wrapped in an Effect
   */
  private performFetch<TResponse = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH",
    baseUrl?: string,
    body?: unknown,
    queryParams?: Record<string, string>,
    useBasicAuth?: boolean
  ): Effect.Effect<TResponse, HttpClientError> {
    const url = this.buildUrl(endpoint, baseUrl, queryParams)

    return Effect.tryPromise({
      try: async () => {
        const requestOptions: RequestInit = {
          method,
          headers: {
            "Authorization": useBasicAuth ? `Basic ${this.config.token}` : `Bearer ${this.config.token}`,
            "Accept": "application/json",
            "HTTP-Referer": this.config.referer,
            "X-Title": this.config.title
          }
        }

        // Add Content-Type and body for POST/PATCH requests
        if (method !== "GET" && body) {
          requestOptions.headers = {
            ...requestOptions.headers,
            "Content-Type": "application/json"
          }
          requestOptions.body = JSON.stringify(body)
        }

        const response = await fetch(url, requestOptions)

        // Check if response is ok
        if (!response.ok) {
          const errorBody = await response.text().catch(() => "")
          throw new HttpRequestError({
            status: response.status,
            statusText: response.statusText,
            url,
            body: errorBody
          })
        }

        // Parse JSON response
        try {
          return await response.json() as TResponse
        } catch (parseError) {
          throw new ParseError({
            message: "Failed to parse JSON response",
            cause: parseError
          })
        }
      },
      catch: (error) => {
        // Handle different error types
        if (error instanceof HttpRequestError || error instanceof ParseError) {
          return error
        }

        // Network or other fetch errors
        return new NetworkError({
          message: error instanceof Error ? error.message : "Unknown network error",
          cause: error
        })
      }
    })
  }

  /**
   * Create a retry schedule based on configuration
   */
  private createRetrySchedule(): Schedule.Schedule<number, HttpClientError> {
    const { exponentialBackoff, initialDelay, maxDelay, maxRetries, retryableStatusCodes } = this.config.retry

    let baseSchedule: Schedule.Schedule<number, unknown>

    if (exponentialBackoff) {
      baseSchedule = pipe(
        Schedule.exponential(`${initialDelay} millis`),
        Schedule.either(Schedule.spaced(`${maxDelay} millis`)),
        Schedule.compose(Schedule.recurs(maxRetries))
      )
    } else {
      baseSchedule = pipe(
        Schedule.spaced(`${initialDelay} millis`),
        Schedule.compose(Schedule.recurs(maxRetries))
      )
    }

    // Only retry on specific errors
    return pipe(
      baseSchedule,
      Schedule.whileInput((error: HttpClientError) => {
        switch (error._tag) {
          case "NetworkError":
            return true // Always retry network errors
          case "TimeoutError":
            return true // Always retry timeout errors
          case "HttpRequestError":
            return retryableStatusCodes.includes(error.status)
          case "ParseError":
            return false // Don't retry parse errors
          default:
            return false
        }
      })
    )
  }

  /**
   * Execute request with timeout and retry logic
   */
  private executeRequestWithRetries<TResponse = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH",
    baseUrl?: string,
    body?: unknown,
    queryParams?: Record<string, string>,
    useBasicAuth?: boolean
  ): Effect.Effect<TResponse, HttpClientError> {
    const fetchEffect = this.performFetch<TResponse>(endpoint, method, baseUrl, body, queryParams, useBasicAuth)
    const timeoutEffect = this.createTimeoutEffect(this.config.retry.timeoutMs)

    // Race fetch against timeout
    const requestWithTimeout = Effect.race(fetchEffect, timeoutEffect)

    // Apply retry logic
    const retrySchedule = this.createRetrySchedule()

    return pipe(
      requestWithTimeout,
      Effect.retry(retrySchedule),
      Effect.tapError((error) => Effect.logError("HTTP request failed after retries", error))
    )
  }

  /**
   * Make a POST request to the API with Effect-based error handling and retries
   */
  async post<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse> {
    const effect = this.executeRequestWithRetries<TResponse>(endpoint, "POST", undefined, body)
    return Effect.runPromise(effect)
  }

  /**
   * Make a GET request to the API with Effect-based error handling and retries
   */
  async get<TResponse = unknown>(endpoint: string, queryParams?: Record<string, string>): Promise<TResponse> {
    const effect = this.executeRequestWithRetries<TResponse>(endpoint, "GET", undefined, undefined, queryParams)
    return Effect.runPromise(effect)
  }

  /**
   * Make a PATCH request to the API with Effect-based error handling and retries
   */
  async patch<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse> {
    const effect = this.executeRequestWithRetries<TResponse>(endpoint, "PATCH", undefined, body)
    return Effect.runPromise(effect)
  }

  /**
   * Make a request to a custom base URL
   */
  async requestWithCustomBaseUrl<TResponse = unknown>(
    method: "GET" | "POST" | "PATCH",
    baseUrl: string,
    endpoint: string,
    body?: unknown,
    queryParams?: Record<string, string>,
    useBasicAuth?: boolean
  ): Promise<TResponse> {
    const effect = this.executeRequestWithRetries<TResponse>(endpoint, method, baseUrl, body, queryParams, useBasicAuth)
    return Effect.runPromise(effect)
  }
}

// ============================================================================
// MAIN CLIENT
// ============================================================================

/**
 * Main Embed API client providing access to personalized feeds and feed management
 *
 * @example
 * ```typescript
 * import { getClient } from '@embed-ai/sdk'
 *
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
export class mbdClient {
  private http: HttpClient
  public readonly feed: FeedNamespace

  constructor(token?: string, options?: mbdClientConfig) {
    if (!token && !options?.token) {
      throw new Error("Token is required")
    }

    const config: mbdClientConfig & { token: string } = {
      token: token || options?.token || "",
      ...options
    }

    this.http = new HttpClient(config)
    this.feed = new FeedNamespace(this.http)
  }
}

/**
 * Get a new Embed Client instance
 *
 * @param token - API token required for authentication
 * @param options - Optional client configuration
 * @returns Embed Client instance with namespaced methods
 *
 * @example
 * ```typescript
 * import { getClient } from '@embed-ai/sdk'
 *
 * // Basic usage
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
 *
 * // With configuration
 * const client = getClient('your-api-key', {
 *   retry: {
 *     maxRetries: 3,
 *     timeoutMs: 30000
 *   }
 * })
 * ```
 */
export function getClient(token?: string, options?: mbdClientConfig): mbdClient {
  return new mbdClient(token, options)
}
