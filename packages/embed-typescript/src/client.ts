import { Data, Effect, pipe, Schedule } from "effect"
import type { ForYouOptions } from "./casts/feed.js"
import { getForYouFeedByUserId, getForYouFeedByWalletAddress } from "./casts/feed.js"
import type { IHttpClient } from "./interfaces/index.js"
import type { ForYouResponse } from "./types-return/ForYou.js"

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
 * Configuration for the embed API client
 */
export interface mbdClientConfig {
  readonly baseUrl?: string
  readonly token?: string
  readonly referer?: string
  readonly title?: string
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

  constructor(config: mbdClientConfig) {
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
   * Perform the actual fetch request wrapped in an Effect
   */
  private performFetch<TResponse = unknown>(
    endpoint: string,
    body?: unknown
  ): Effect.Effect<TResponse, HttpClientError> {
    const url = `${this.config.baseUrl}${endpoint}`

    return Effect.tryPromise({
      try: async () => {
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
    body?: unknown
  ): Effect.Effect<TResponse, HttpClientError> {
    const fetchEffect = this.performFetch<TResponse>(endpoint, body)
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
    const effect = this.executeRequestWithRetries<TResponse>(endpoint, body)

    return Effect.runPromise(effect)
  }
}

// ============================================================================
// MAIN CLIENT
// ============================================================================

/**
 * Main mbd API client - your complete SDK with Effect-based error handling
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
