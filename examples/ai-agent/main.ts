import { AiLanguageModel } from "@effect/ai"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { NodeHttpClient } from "@effect/platform-node"
import { getClient } from "@embed-ai/sdk"
import { Config, Console, Effect, Layer, Redacted } from "effect"

const generateDadJoke = Effect.gen(function*() {
  const key = yield* Config.redacted("API_KEY_EMBED")
  const client = getClient(Redacted.value(key))

  // Convert the Promise to Effect using Effect.tryPromise
  const feed = yield* Effect.tryPromise({
    try: () => client.feed.byUserId("16085", "feed_274", { top_k: 10 }), // fun music feed
    catch: (error) => new Error(`Failed to get feed: ${error}`)
  })

  const response = yield* AiLanguageModel.generateText({
    prompt: `In a fun way summarize the following feed of the most interesting content: ${JSON.stringify(feed)}`
  })
  console.log(response.text)
  return response
})

const Gpt4o = OpenAiLanguageModel.model("gpt-4o")

const main = generateDadJoke.pipe(
  Effect.provide(Gpt4o)
)

const OpenAi = OpenAiClient.layerConfig({
  apiKey: Config.redacted("API_KEY_OPENAI")
})

const OpenAiWithHttp = Layer.provide(OpenAi, NodeHttpClient.layer)

// Add error handling and debugging
main.pipe(
  Effect.provide(OpenAiWithHttp),
  Effect.catchAll((error) => {
    Console.error("Caught error:", error)
    if (error && typeof error === "object" && "_tag" in error) {
      Console.error("Error type:", (error as any)._tag)
    } else {
      Console.error("Error type: unknown")
    }
    Console.error("Error details:", JSON.stringify(error, null, 2))
    return Effect.fail(error)
  }),
  Effect.runPromise
)
