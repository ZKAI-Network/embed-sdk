import type { Layer } from "effect"
import { Effect } from "effect"
import { EmbedApi, getClient, type MbdApiConfig, type MbdHttpClient } from "./client-effect.js"

/**
 * Promise-based wrapper for the mbd.xyz HTTP client
 * This provides a familiar Promise API while using the underlying Effect implementation
 */
export class MbdPromiseClient {
  private layer: Layer.Layer<MbdHttpClient, unknown, never>

  constructor(configOrToken?: string | MbdApiConfig) {
    if (!configOrToken) {
      this.layer = getClient()
    } else if (typeof configOrToken === "string") {
      this.layer = getClient(configOrToken)
    } else {
      this.layer = getClient(configOrToken)
    }
  }

  /**
   * Wrapped EmbedApi client with all methods automatically converted to Promises
   */
  get api() {
    return new Proxy(EmbedApi, {
      get: (target, prop) => {
        const originalMethod = target[prop as keyof typeof target]

        if (typeof originalMethod === "function") {
          return (...args: Array<unknown>) => {
            const effect =
              (originalMethod as (...args: Array<unknown>) => Effect.Effect<unknown, unknown, MbdHttpClient>)
                .apply(
                  target,
                  args
                )
            return Effect.runPromise(effect.pipe(Effect.provide(this.layer)))
          }
        }

        return originalMethod
      }
    })
  }
}

/**
 * Factory function to create a promise-based client
 * - createMbdClient() - uses API_KEY_EMBED from environment
 * - createMbdClient(token) - uses token with default config
 * - createMbdClient(config) - uses full configuration
 */
export function createMbdClient(): MbdPromiseClient
export function createMbdClient(token: string): MbdPromiseClient
export function createMbdClient(config: MbdApiConfig): MbdPromiseClient
export function createMbdClient(configOrToken?: string | MbdApiConfig): MbdPromiseClient {
  return new MbdPromiseClient(configOrToken)
}
