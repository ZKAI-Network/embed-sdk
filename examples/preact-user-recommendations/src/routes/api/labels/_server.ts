import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { getClient } from "@embed-ai/sdk"
import type { UserLabelsResponse } from "@embed-ai/types"
import { Effect } from "effect"

export const GET = Effect
  .gen(function*() {
    const request = yield* HttpServerRequest.HttpServerRequest

    // Extract query parameters from URL
    const queryStart = request.url.indexOf("?")
    const searchParams = queryStart >= 0
      ? new URLSearchParams(request.url.substring(queryStart + 1))
      : new URLSearchParams()

    const fid = searchParams.get("fid")

    if (!fid) {
      return yield* HttpServerResponse.json(
        { error: "fid parameter is required" },
        { status: 400 },
      )
    }

    const client = getClient(process.env.API_KEY_EMBED!)

    const results: UserLabelsResponse = yield* Effect.tryPromise(() =>
      client.search.users.getLabels([fid], "all", { top_k: 25 })
    )

    return yield* HttpServerResponse.json({
      results,
      parameters: { fid },
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
