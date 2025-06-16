/**
 * HTTP client interface for making API requests
 */
export interface IHttpClient {
  post<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse>
}
