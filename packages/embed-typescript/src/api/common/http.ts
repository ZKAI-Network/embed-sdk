import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"
import { MbdHttpClient } from "../../client-effect.js"

/**
 * Generic POST request to any embed API endpoint
 */
export const post = (endpoint: string, body?: unknown) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const request = body
      ? yield* HttpClientRequest.post(endpoint).pipe(HttpClientRequest.bodyJson(body))
      : HttpClientRequest.post(endpoint)
    const response = yield* client.execute(request)
    return yield* response.json
  })

/**
 * Generic GET request to any embed API endpoint
 */
export const get = (endpoint: string) =>
  Effect.gen(function*() {
    const client = yield* MbdHttpClient
    const response = yield* client.get(endpoint)
    return yield* response.json
  })
