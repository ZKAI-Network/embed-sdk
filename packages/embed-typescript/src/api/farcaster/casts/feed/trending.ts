import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"
import { MbdHttpClient } from "../../../../client-effect.js"

/**
 * Get trending casts
 */
export const Trending = (options?: { limit?: number; timeWindow?: string }) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const request = options
      ? yield* HttpClientRequest.post("/v2/farcaster/casts/feed/trending").pipe(HttpClientRequest.bodyJson(options))
      : HttpClientRequest.post("/v2/farcaster/casts/feed/trending")
    const response = yield* client.execute(request)
    return yield* response.json
  })
