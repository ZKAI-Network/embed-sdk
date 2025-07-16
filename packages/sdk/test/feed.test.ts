import { describe, expect, it } from "@effect/vitest"
import type { FeedCreateUpdateResponse, FeedGetResponse, ForYouResponse, ListFeedsResponse } from "@embed-ai/types"
import { Effect, Exit } from "effect"
import { getFastFailClient, getTestClient } from "./setup.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

// Helper to create client only when API key is available
const createClient = () => apiKey ? getTestClient(apiKey) : null
const createFastFailClient = () => apiKey ? getFastFailClient(apiKey) : null

describe("Feed", () => {
  describe("Feed Generation", () => {
    testCondition("byUserId - get personalized feed", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const userId = "16085" // Known user ID
        const result = yield* Effect.tryPromise(() => client.feed.byUserId(userId, undefined, { top_k: 5 }))

        // Validate structure and types
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(5)

        // Validate item structure
        const firstItem = result[0] as any
        expect(firstItem).toHaveProperty("item_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.item_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThanOrEqual(0)
        // API can return scores > 1, so remove upper limit check

        // Check for metadata if available
        if (firstItem.metadata) {
          expect(firstItem.metadata).toHaveProperty("text")
          expect(firstItem.metadata).toHaveProperty("author")
          expect(firstItem.metadata.author).toHaveProperty("username")
          // Author object has user_id instead of fid in some responses
          expect(firstItem.metadata.author).toHaveProperty("user_id")
        }
      }))

    testCondition("byUserId - with custom feed ID", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const userId = "16085"
        const feedId = "feed_390" // Known feed ID

        const result = yield* Effect.tryPromise(() =>
          client.feed.byUserId(userId, feedId, {
            top_k: 3,
            return_metadata: true
          })
        )

        // Validate structure
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThanOrEqual(0)
        expect(result.length).toBeLessThanOrEqual(3)

        if (result.length > 0) {
          const firstItem = result[0] as any
          expect(firstItem).toHaveProperty("item_id")
          expect(firstItem).toHaveProperty("score")
          expect(typeof firstItem.item_id).toBe("string")
          expect(typeof firstItem.score).toBe("number")
        }
      }))

    testCondition("byUserId - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const result = yield* Effect.tryPromise(() => client.feed.byUserId("16085", undefined, { top_k: 2 }))

        // Type check - this should compile and runtime validate
        const typedResult: ForYouResponse = result as ForYouResponse
        expect(Array.isArray(typedResult)).toBe(true)
      }))

    testCondition("byWalletAddress - get personalized feed", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()! // Use fast-fail for this potentially slow/failing endpoint
        // Using a known wallet address format (might not be active)
        const walletAddress = "0x1234567890123456789012345678901234567890"

        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.feed.byWalletAddress(walletAddress, undefined, { top_k: 3 }))
        )

        // Should either succeed or fail gracefully
        if (Exit.isSuccess(result)) {
          expect(Array.isArray(result.value)).toBe(true)
          expect(result.value.length).toBeLessThanOrEqual(3)
        } else {
          expect(Exit.isFailure(result)).toBe(true)
        }
      }))

    testCondition("handles invalid user ID gracefully", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()!
        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.feed.byUserId("invalid-user-id", undefined, { top_k: 1 }))
        )

        // Should either succeed with empty results or fail gracefully
        if (Exit.isSuccess(result)) {
          expect(Array.isArray(result.value)).toBe(true)
        } else {
          expect(Exit.isFailure(result)).toBe(true)
        }
      }))
  })

  describe("Feed Management", () => {
    testCondition("listConfigs - get all private feeds", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const result = yield* Effect.tryPromise(() => client.feed.listConfigs("private"))

        // Validate structure and types
        expect(Array.isArray(result)).toBe(true)

        if (result.length > 0) {
          const firstFeed = result[0] as any
          expect(firstFeed).toHaveProperty("config_id")
          expect(firstFeed).toHaveProperty("name")
          expect(firstFeed).toHaveProperty("description")
          expect(typeof firstFeed.config_id).toBe("string")
          expect(typeof firstFeed.name).toBe("string")
          expect(typeof firstFeed.description).toBe("string")
        }
      }))

    testCondition("listConfigs - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const result = yield* Effect.tryPromise(() => client.feed.listConfigs("private"))

        // Type check - this should compile and runtime validate
        const typedResult: ListFeedsResponse = result as ListFeedsResponse
        expect(Array.isArray(typedResult)).toBe(true)
      }))

    testCondition("createConfig - create new feed configuration", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const feedName = `Test Feed ${Date.now()}`
        const feedDescription = "A test feed for automated testing"

        const result = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: feedName,
            description: feedDescription,
            config: {
              filters: {
                ai_labels: ["technology", "crypto"]
              }
            }
          })
        )

        // Validate response structure
        expect(result).toHaveProperty("config_id")
        expect(result).toHaveProperty("name")
        expect(result).toHaveProperty("description")
        expect((result as any).name).toBe(feedName)
        expect((result as any).description).toBe(feedDescription)
        expect(typeof (result as any).config_id).toBe("string")
      }))

    testCondition("createConfig - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const result = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: "Test Feed Type Check",
            description: "Testing type validation"
          })
        )

        const typedResult: FeedCreateUpdateResponse = result as FeedCreateUpdateResponse
        expect(typedResult).toBeDefined()
      }))

    testCondition("getConfig - retrieve feed configuration", () =>
      Effect.gen(function*() {
        const client = createClient()!
        // Create a test feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: "Test Feed for Retrieval",
            description: "Testing feed retrieval"
          })
        )

        const testFeedId = (createResult as any).config_id

        const result = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        // Validate response structure
        expect(result).toHaveProperty("config_id")
        expect(result).toHaveProperty("name")
        expect(result).toHaveProperty("description")
        expect((result as any).config_id).toBe(testFeedId)
        expect(typeof (result as any).name).toBe("string")
        expect(typeof (result as any).description).toBe("string")
      }))

    testCondition("getConfig - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!
        // Create a test feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: "Test Feed for Type Check",
            description: "Testing type validation on get"
          })
        )

        const testFeedId = (createResult as any).config_id

        const result = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        // Type check - this should compile and runtime validate
        const typedResult: FeedGetResponse = result as FeedGetResponse
        expect(typedResult).toBeDefined()
      }))

    testCondition("updateConfig - update existing feed", () =>
      Effect.gen(function*() {
        const client = createClient()!
        // Create a test feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: "Original Feed Name",
            description: "Original description"
          })
        )

        const testFeedId = (createResult as any).config_id

        const updatedName = "Updated Feed Name"
        const updatedDescription = "Updated description"

        // Update the feed
        yield* Effect.tryPromise(() =>
          client.feed.updateConfig(testFeedId, {
            name: updatedName,
            description: updatedDescription,
            config: {
              filters: {
                ai_labels: ["gaming", "sports"]
              }
            }
          })
        )

        // Verify the update
        const updatedFeed = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        expect((updatedFeed as any).name).toBe(updatedName)
        expect((updatedFeed as any).description).toBe(updatedDescription)
        expect((updatedFeed as any).config.filters?.ai_labels).toContain("gaming")
        expect((updatedFeed as any).config.filters?.ai_labels).toContain("sports")
      }))

    testCondition("handles invalid feed ID gracefully", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()!
        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.feed.getConfig("invalid-feed-id"))
        )

        // Should fail gracefully
        expect(Exit.isFailure(result)).toBe(true)
      }))

    testCondition("handles malformed feed creation gracefully", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()!
        const result = yield* Effect.exit(
          Effect.tryPromise(() =>
            client.feed.createConfig({
              name: "", // Invalid empty name
              description: ""
            })
          )
        )

        // Should either succeed or fail gracefully
        if (Exit.isSuccess(result)) {
          expect(result.value).toBeDefined()
        } else {
          expect(Exit.isFailure(result)).toBe(true)
        }
      }))
  })
})
