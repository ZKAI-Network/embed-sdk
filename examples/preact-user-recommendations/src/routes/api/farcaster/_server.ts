import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
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

    // Parse FIDs - support both single FID and comma-separated FIDs
    const fids = fid.split(",").map((id) => id.trim()).filter((id) =>
      id.length > 0
    )

    if (!process.env.API_KEY_NEYNAR) {
      return yield* HttpServerResponse.json(
        { error: "API_KEY_NEYNAR environment variable is not set" },
        { status: 500 },
      )
    }

    // call neynar with a fetch call wrapped by effect to get user data and return the profile picture, username
    const response = yield* Effect.tryPromise(() =>
      fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk/?fids=${fids.join(",")}`,
        {
          headers: {
            "x-api-key": process.env.API_KEY_NEYNAR!,
          },
        },
      )
    )

    if (!response.ok) {
      return yield* HttpServerResponse.json(
        {
          error: `Neynar API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      )
    }

    const userdata = yield* Effect.tryPromise(() => response.json())

    // Check if the response has the expected structure
    if (!userdata || !userdata.users || !Array.isArray(userdata.users)) {
      console.log("Unexpected API response:", userdata)
      return yield* HttpServerResponse.json(
        { error: "Invalid response from Neynar API", debug: userdata },
        { status: 500 },
      )
    }

    // Transform users array into a map keyed by FID for efficient lookup
    const results: Record<string, { pfp?: string; username?: string }> = {}

    for (const user of userdata.users) {
      results[user.fid.toString()] = {
        pfp: user.pfp_url,
        username: user.username,
      }
    }

    // For single FID requests, maintain backward compatibility
    if (fids.length === 1) {
      const singleResult = results[fids[0]]
      if (!singleResult) {
        return yield* HttpServerResponse.json(
          { error: `No user found for FID ${fids[0]}` },
          { status: 404 },
        )
      }
      return yield* HttpServerResponse.json({
        results: singleResult,
        parameters: { fid },
      })
    }

    // For bulk requests, return all results
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
