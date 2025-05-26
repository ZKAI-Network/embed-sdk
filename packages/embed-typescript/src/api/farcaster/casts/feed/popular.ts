import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"
import { MbdHttpClient } from "../../../../client-effect.js"

/**
 * Get popular casts
 */
export const Popular = (options?: { limit?: number; timeWindow?: string }) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const request = options
      ? yield* HttpClientRequest.post("/v2/farcaster/casts/feed/popular").pipe(HttpClientRequest.bodyJson(options))
      : HttpClientRequest.post("/v2/farcaster/casts/feed/popular")
    const response = yield* client.execute(request)
    return yield* response.json
  })
