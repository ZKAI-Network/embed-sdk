import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"
import { MbdHttpClient } from "../../../../client-effect.js"

/**
 * Get the "for you" feed from Farcaster casts
 */
export const ForYou = (options?: { limit?: number; cursor?: string }) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const request = options
      ? yield* HttpClientRequest.post("/v2/farcaster/casts/feed/for-you").pipe(HttpClientRequest.bodyJson(options))
      : HttpClientRequest.post("/v2/farcaster/casts/feed/for-you")
    const response = yield* client.execute(request)
    return yield* response.json
  })
