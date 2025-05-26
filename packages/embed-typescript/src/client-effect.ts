import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform"
import { Config, Context, Effect, Layer } from "effect"

/**
 * Configuration for the embed API client
 */
export interface MbdApiConfig {
  readonly baseUrl: string
  readonly token: string
  readonly referer?: string
  readonly title?: string
}

/**
 * Default configuration for the embed API
 */
export const defaultMbdApiConfig: Omit<MbdApiConfig, "token"> = {
  baseUrl: "https://api.mbd.xyz",
  title: "embed_sdk_typescript"
}

/**
 * Config for API key from environment variable
 */
export const ApiKeyConfig = Config.string("API_KEY_EMBED").pipe(
  Config.withDescription("mbd.xyz API key from environment variable")
)

/**
 * Service tag for MbdApiConfig
 */
export class MbdApiConfigService extends Context.Tag("MbdApiConfig")<
  MbdApiConfigService,
  MbdApiConfig
>() {}

/**
 * Creates a pre-configured HTTP client for the embed API
 * All requests will automatically include the required headers
 */
export const makeMbdHttpClient = Effect.gen(function*() {
  const config = yield* MbdApiConfigService
  const baseClient = yield* HttpClient.HttpClient

  return baseClient.pipe(
    HttpClient.mapRequest((request) =>
      request.pipe(
        // Set the base URL if the request URL is relative
        HttpClientRequest.prependUrl(config.baseUrl),
        // Set required headers
        HttpClientRequest.setHeaders({
          "HTTP-Referer": config.referer ?? defaultMbdApiConfig.referer,
          "X-Title": config.title ?? defaultMbdApiConfig.title,
          "accept": "application/json",
          "content-type": "application/json"
        }),
        // Set Bearer token authorization
        HttpClientRequest.bearerToken(config.token)
      )
    )
  )
})

/**
 * Service tag for the configured mbd HTTP client
 */
export class MbdHttpClient extends Context.Tag("MbdHttpClient")<
  MbdHttpClient,
  HttpClient.HttpClient
>() {}

/**
 * Layer that provides the configured mbd HTTP client
 */
const MbdHttpClientLive = Layer.effect(MbdHttpClient, makeMbdHttpClient)

/**
 * Creates a complete layer with configuration
 */
const makeMbdClientLayer = (config: MbdApiConfig) =>
  MbdHttpClientLive.pipe(
    Layer.provide(Layer.succeed(MbdApiConfigService, config)),
    Layer.provide(FetchHttpClient.layer)
  )

/**
 * Creates a layer with just a token (uses default config)
 */
const makeMbdClientLayerWithToken = (token: string) =>
  makeMbdClientLayer({
    ...defaultMbdApiConfig,
    token
  })

/**
 * Creates a layer using API key from environment variable
 */
const makeMbdClientLayerFromEnv = () =>
  Layer.unwrapEffect(
    Effect.gen(function*() {
      const token = yield* ApiKeyConfig
      return makeMbdClientLayer({
        ...defaultMbdApiConfig,
        token
      })
    })
  )

// Export the EmbedApi from the new modular structure
export { EmbedApi } from "./api/index.js"

// Overloaded function signatures
export function getClient(): ReturnType<typeof makeMbdClientLayerFromEnv>
export function getClient(token: string): ReturnType<typeof makeMbdClientLayerWithToken>
export function getClient(config: MbdApiConfig): ReturnType<typeof makeMbdClientLayer>

/**
 * Intelligent client factory function
 * - getClient() - uses API_KEY_EMBED from environment
 * - getClient(token) - uses token with default config
 * - getClient(config) - uses full configuration
 */
export function getClient(configOrToken?: string | MbdApiConfig) {
  if (!configOrToken) {
    // No parameters - use environment variable
    return makeMbdClientLayerFromEnv()
  }

  if (typeof configOrToken === "string") {
    // String parameter - use as token with default config
    return makeMbdClientLayerWithToken(configOrToken)
  }

  // Object parameter - use as full config
  return makeMbdClientLayer(configOrToken)
}
