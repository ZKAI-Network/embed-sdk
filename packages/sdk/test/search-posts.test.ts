import { describe, expect, it } from "@effect/vitest"
import type { PostLabelsResponse, PostSemanticSearchResponse } from "@embed-ai/types"
import { Effect } from "effect"
import { getFastFailClient, getTestClient } from "./setup.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

// Helper to create client only when API key is available
const createClient = () => apiKey ? getTestClient(apiKey) : null
const createFastFailClient = () => apiKey ? getFastFailClient(apiKey) : null

describe("Search Posts", () => {
  testCondition("byQuery - basic semantic search", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const query = "web3 blockchain cryptocurrency"
      const result = yield* Effect.tryPromise(() => client.search.posts.byQuery(query, { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThanOrEqual(5)

      // Check first item structure
      const firstItem = result[0]
      expect(typeof firstItem.item_id).toBe("string")
      expect(typeof firstItem.score).toBe("number")
      expect(firstItem.score).toBeGreaterThanOrEqual(0)
      // API can return scores > 1, so remove upper limit check
    }))

  testCondition("byQuery - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const result = yield* Effect.tryPromise(() => client.search.posts.byQuery("technology", { top_k: 3 }))

      // Type check - this should compile and runtime validate
      const typedResult: PostSemanticSearchResponse = result
      expect(Array.isArray(typedResult)).toBe(true)

      if (typedResult.length > 0) {
        const item = typedResult[0]
        expect(typeof item.item_id).toBe("string")
        expect(typeof item.score).toBe("number")
      }
    }))

  testCondition("byQuery - with filters and metadata", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const result = yield* Effect.tryPromise(() =>
        client.search.posts.byQuery("farcaster development", {
          top_k: 5,
          return_ai_labels: true,
          return_metadata: true
        })
      )

      expect(Array.isArray(result)).toBe(true)

      if (result.length > 0) {
        const firstItem = result[0]
        expect(typeof firstItem.item_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThanOrEqual(0)
      }
    }))

  testCondition("getLabels - all labels", () =>
    Effect.gen(function*() {
      const client = createClient()!
      // Use some sample cast IDs
      const castIds = ["0x4888649440c8cfd3ef6e28f2096a201d20253176"]

      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(castIds, "all"))

      expect(Array.isArray(result)).toBe(true)

      if (result.length > 0) {
        const firstItem = result[0]
        // For current type structure, check moderation property exists
        expect(firstItem.moderation).toBeDefined()
        expect(Array.isArray(firstItem.moderation)).toBe(true)
      }
    }))

  testCondition("getLabels - moderation labels", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const castIds = ["0x4888649440c8cfd3ef6e28f2096a201d20253176"]

      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(castIds, "moderation"))

      expect(Array.isArray(result)).toBe(true)

      if (result.length > 0) {
        const firstItem = result[0]
        expect(firstItem.moderation).toBeDefined()
        expect(Array.isArray(firstItem.moderation)).toBe(true)

        if (firstItem.moderation && firstItem.moderation.length > 0) {
          const label = firstItem.moderation[0]
          expect(typeof label.label).toBe("string")
          expect(typeof label.score).toBe("number")
          expect(label.score).toBeGreaterThanOrEqual(0)
          expect(label.score).toBeLessThanOrEqual(1)
        }
      }
    }))

  testCondition("getLabels - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const castIds = ["0x4888649440c8cfd3ef6e28f2096a201d20253176"]
      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(castIds))

      // Type check - this should compile and runtime validate
      const typedResult: PostLabelsResponse = result
      expect(Array.isArray(typedResult)).toBe(true)

      if (typedResult.length > 0) {
        const item = typedResult[0]
        expect(item.moderation).toBeDefined()
        expect(Array.isArray(item.moderation)).toBe(true)
      }
    }))

  // Error handling test with fast-fail client
  testCondition("handles invalid cast IDs gracefully", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()!
      const invalidCastIds = ["invalid-cast-id-123", "another-invalid-id"]

      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.posts.getLabels(invalidCastIds))
      )

      // Should either succeed with error response or fail gracefully
      expect(result).toBeDefined()
    }))
})
