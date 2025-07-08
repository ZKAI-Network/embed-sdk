/**
 * HTTP client interface for making API requests
 */
export interface IHttpClient {
  post<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse>
  get<TResponse = unknown>(endpoint: string, queryParams?: Record<string, string>): Promise<TResponse>
  patch<TResponse = unknown>(endpoint: string, body?: unknown): Promise<TResponse>
  requestWithCustomBaseUrl<TResponse = unknown>(
    method: "GET" | "POST" | "PATCH",
    baseUrl: string,
    endpoint: string,
    body?: unknown,
    queryParams?: Record<string, string>
  ): Promise<TResponse>
}
