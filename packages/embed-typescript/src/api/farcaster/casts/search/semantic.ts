import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"
import { MbdHttpClient } from "../../../../client-effect.js"

/**
 * Semantic search for casts
 */
export const Search = (options: { query: string; limit?: number }) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const request = yield* HttpClientRequest.post("/v2/farcaster/casts/search/semantic").pipe(
      HttpClientRequest.bodyJson(options)
    )
    const response = yield* client.execute(request)
    return yield* response.json
  })
