import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { getClient } from "@embed-ai/sdk"
import { Effect } from "effect"

export const GET = Effect
  .gen(function*() {
    const request = yield* HttpServerRequest.HttpServerRequest

    // Extract query parameters from URL
    const queryStart = request.url.indexOf("?")
    const searchParams = queryStart >= 0
      ? new URLSearchParams(request.url.substring(queryStart + 1))
      : new URLSearchParams()

    const semantic = searchParams.get("semantic") === "true"
    const query = searchParams.get("query")
    const topic = searchParams.get("topic")

    if (!query && !topic) {
      return yield* HttpServerResponse.json(
        { error: "Either query or topic parameter is required" },
        { status: 400 },
      )
    }

    if (semantic && !query) {
      return yield* HttpServerResponse.json(
        { error: "Query parameter is required when semantic=true" },
        { status: 400 },
      )
    }

    if (!semantic && !topic) {
      return yield* HttpServerResponse.json(
        { error: "Topic parameter is required when semantic=false" },
        { status: 400 },
      )
    }

    const client = getClient(process.env.API_KEY_EMBED!)

    let results: Array<any> = []

    if (semantic && query) {
      results = yield* Effect.tryPromise(() =>
        client.search.users.byQuery(query, { top_k: 25 })
      )
    } else if (!semantic && topic) {
      results = yield* Effect.tryPromise(() =>
        client.search.users.getTopByLabel(topic as any, {
          top_k: 25,
          scoring: "all",
          minimum_activity_count: 10,
          ratio_min: 0.75,
          conf_min: 0.6,
        })
      )
    }

    return yield* HttpServerResponse.json({
      results,
      search_type: semantic ? "semantic" : "label",
      parameters: { semantic, query, topic, top_k: 25 },
    })
  })
  .pipe(
    Effect.catchAll((error) =>
      HttpServerResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 },
      )
    ),
  )
