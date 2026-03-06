import { HttpServerResponse } from "@effect/platform"

export const GET = HttpServerResponse.json({
  message: "Debug endpoint",
  hasApiKey: !!process.env.API_KEY_EMBED,
  apiKeyLength: process.env.API_KEY_EMBED?.length || 0,
  env: process.env.NODE_ENV || "development",
})
