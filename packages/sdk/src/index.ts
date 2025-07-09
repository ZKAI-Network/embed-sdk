// Export the main client factory function
export { getClient, mbdClient } from "./client.js"

// Export error types for error handling
export { type HttpClientError, HttpRequestError, NetworkError, ParseError, TimeoutError } from "./client.js"

// Export configuration types
export type { mbdClientConfig, RetryConfig } from "./client.js"

// Export feed namespace
export { FeedNamespace } from "./feed/namespace.js"
