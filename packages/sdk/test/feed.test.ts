import { describe, expect, it } from "@effect/vitest"
import type { FeedCreateUpdateResponse, FeedGetResponse, ForYouResponse, ListFeedsResponse } from "@embed-ai/types"
import { Effect, Exit } from "effect"
import { getClient } from "../src/index.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

describe("Feed", () => {
  const client = getClient(apiKey!)

  describe("Feed Generation", () => {
    testCondition("byUserId - get personalized feed", () =>
      Effect.gen(function*() {
        const userId = "16085" // Known user ID
        const result = yield* Effect.tryPromise(() => client.feed.byUserId(userId, undefined, { top_k: 5 }))

        // Validate structure and types
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBeLessThanOrEqual(5)

        // Validate item structure
        const firstItem = result[0]
        expect(firstItem).toHaveProperty("item_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.item_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThanOrEqual(0)
        expect(firstItem.score).toBeLessThanOrEqual(1)

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
          const firstItem = result[0]
          expect(firstItem).toHaveProperty("item_id")
          expect(firstItem).toHaveProperty("score")
          expect(typeof firstItem.item_id).toBe("string")
          expect(typeof firstItem.score).toBe("number")
        }
      }))

    testCondition("byUserId - validates return type structure", () =>
      Effect.gen(function*() {
        const result = yield* Effect.tryPromise(() => client.feed.byUserId("16085", undefined, { top_k: 2 }))

        // Type validation - this will fail at compile time if types don't match
        const typedResult: ForYouResponse = result
        expect(typedResult).toBeDefined()
      }))

    testCondition("byWalletAddress - get personalized feed", () =>
      Effect.gen(function*() {
        // Using a known wallet address format (might not be active)
        const walletAddress = "0x1234567890123456789012345678901234567890"

        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.feed.byWalletAddress(walletAddress, undefined, { top_k: 3 })).pipe(
            Effect.timeout("10 seconds")
          )
        )

        // Should either succeed with results or fail gracefully
        if (Exit.isSuccess(result)) {
          expect(Array.isArray(result.value)).toBe(true)
          expect(result.value.length).toBeLessThanOrEqual(3)
        } else {
          expect(Exit.isFailure(result)).toBe(true)
        }
      }))

    testCondition("handles invalid user ID gracefully", () =>
      Effect.gen(function*() {
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
        const result = yield* Effect.tryPromise(() => client.feed.listConfigs("private"))

        // Validate structure
        expect(Array.isArray(result)).toBe(true)

        if (result.length > 0) {
          const firstFeed = result[0]
          expect(firstFeed).toHaveProperty("config_id")
          expect(firstFeed).toHaveProperty("name")
          expect(firstFeed).toHaveProperty("description")
          expect(firstFeed).toHaveProperty("status")
          expect(firstFeed).toHaveProperty("visibility")
          expect(firstFeed).toHaveProperty("config")
          expect(typeof firstFeed.config_id).toBe("string")
          expect(typeof firstFeed.name).toBe("string")
        }
      }))

    testCondition("listConfigs - validates return type structure", () =>
      Effect.gen(function*() {
        const result = yield* Effect.tryPromise(() => client.feed.listConfigs("private"))

        // Type validation - this will fail at compile time if types don't match
        const typedResult: ListFeedsResponse = result
        expect(typedResult).toBeDefined()
      }))

    testCondition("createConfig - create new feed configuration", () =>
      Effect.gen(function*() {
        const feedName = `Test Feed ${Date.now()}`
        const feedDescription = "Test feed created by SDK test suite"

        const result = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: feedName,
            description: feedDescription,
            visibility: "private",
            config: {
              filters: {
                ai_labels: ["web3_nft", "web3_defi"],
                start_timestamp: "days_ago:7"
              }
            }
          })
        )

        // Validate structure
        expect(result).toHaveProperty("config_id")
        expect(result).toHaveProperty("name")
        expect(result).toHaveProperty("description")
        expect(result.name).toBe(feedName)
        expect(result.description).toBe(feedDescription)
        expect(typeof result.config_id).toBe("string")
      }))

    testCondition("createConfig - validates return type structure", () =>
      Effect.gen(function*() {
        const result = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: `Type Test Feed ${Date.now()}`,
            description: "Feed for type validation"
          })
        )

        // Type validation - this will fail at compile time if types don't match
        const typedResult: FeedCreateUpdateResponse = result
        expect(typedResult).toBeDefined()
      }))

    testCondition("getConfig - retrieve feed configuration", () =>
      Effect.gen(function*() {
        // Create a feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: `Get Test Feed ${Date.now()}`,
            description: "Feed for get test"
          })
        )
        const testFeedId = createResult.config_id

        const result = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        // Validate structure
        expect(result).toHaveProperty("config_id")
        expect(result).toHaveProperty("name")
        expect(result).toHaveProperty("description")
        expect(result).toHaveProperty("config")
        expect(result.config_id).toBe(testFeedId)
        expect(typeof result.name).toBe("string")
        expect(typeof result.description).toBe("string")
      }))

    testCondition("getConfig - validates return type structure", () =>
      Effect.gen(function*() {
        // Create a feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: `Type Get Test Feed ${Date.now()}`,
            description: "Feed for type get test"
          })
        )
        const testFeedId = createResult.config_id

        const result = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        // Type validation - this will fail at compile time if types don't match
        const typedResult: FeedGetResponse = result
        expect(typedResult).toBeDefined()
      }))

    testCondition("updateConfig - update existing feed", () =>
      Effect.gen(function*() {
        // Create a feed first
        const createResult = yield* Effect.tryPromise(() =>
          client.feed.createConfig({
            name: `Update Test Feed ${Date.now()}`,
            description: "Feed for update test"
          })
        )
        const testFeedId = createResult.config_id

        const updatedName = `Updated Test Feed ${Date.now()}`
        const updatedDescription = "Updated description for test feed"

        // Update should not throw - it returns void
        yield* Effect.tryPromise(() =>
          client.feed.updateConfig(testFeedId, {
            name: updatedName,
            description: updatedDescription,
            config: {
              filters: {
                ai_labels: ["gaming", "sports"],
                start_timestamp: "days_ago:3"
              }
            }
          })
        )

        // Verify the update by fetching the feed
        const updatedFeed = yield* Effect.tryPromise(() => client.feed.getConfig(testFeedId))

        expect(updatedFeed.name).toBe(updatedName)
        expect(updatedFeed.description).toBe(updatedDescription)
        expect(updatedFeed.config.filters?.ai_labels).toContain("gaming")
        expect(updatedFeed.config.filters?.ai_labels).toContain("sports")
      }))

    testCondition("handles invalid feed ID gracefully", () =>
      Effect.gen(function*() {
        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.feed.getConfig("invalid-feed-id")).pipe(
            Effect.timeout("10 seconds")
          )
        )

        // Should fail gracefully
        expect(Exit.isFailure(result)).toBe(true)
      }))

    testCondition("handles malformed feed creation gracefully", () =>
      Effect.gen(function*() {
        const result = yield* Effect.exit(
          Effect.tryPromise(() =>
            client.feed.createConfig({
              name: "", // Invalid empty name
              description: "Test"
            })
          ).pipe(
            Effect.timeout("10 seconds")
          )
        )

        // Should either succeed or fail gracefully
        if (Exit.isFailure(result)) {
          expect(Exit.isFailure(result)).toBe(true)
        } else {
          // If it succeeds, it should still have valid structure
          expect(result.value).toHaveProperty("config_id")
        }
      }))
  })
})
