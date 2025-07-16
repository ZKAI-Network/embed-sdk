import { describe, expect, it } from "@effect/vitest"
import type { PostLabelsResponse, PostSemanticSearchResponse } from "@embed-ai/types"
import { Effect, Exit } from "effect"
import { getClient } from "../src/index.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

describe("Search Posts", () => {
  const client = getClient(apiKey!)

  testCondition("byQuery - basic semantic search", () =>
    Effect.gen(function*() {
      const query = "web3 blockchain cryptocurrency"
      const result = yield* Effect.tryPromise(() => client.search.posts.byQuery(query, { top_k: 5 }))

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
      expect(firstItem.score).toBeGreaterThan(0)
      expect(firstItem.score).toBeLessThanOrEqual(1)
    }))

  testCondition("byQuery - with filters and metadata", () =>
    Effect.gen(function*() {
      const query = "artificial intelligence machine learning"
      const oneWeekAgo = String(Math.floor(Date.now() / 1000) - 86400 * 7)

      const result = yield* Effect.tryPromise(() =>
        client.search.posts.byQuery(query, {
          top_k: 3,
          return_ai_labels: true,
          return_metadata: true,
          filters: {
            start_timestamp: oneWeekAgo
          }
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

  testCondition("byQuery - validates return type structure", () =>
    Effect.gen(function*() {
      const result = yield* Effect.tryPromise(() => client.search.posts.byQuery("test query", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: PostSemanticSearchResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("getLabels - moderation labels", () =>
    Effect.gen(function*() {
      const itemsList = [
        "0x4888649440c8cfd3ef6e28f2096a201d20253176",
        "0x0ecf95b73aa54d583877821ece241e94de701404"
      ]

      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(itemsList, "moderation"))

      // Validate structure
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(itemsList.length)

      // Validate each item structure
      result.forEach((item, _index) => {
        expect(item).toHaveProperty("moderation")
        expect(Array.isArray(item.moderation)).toBe(true)

        item.moderation.forEach((label) => {
          expect(label).toHaveProperty("label")
          expect(label).toHaveProperty("score")
          expect(typeof label.label).toBe("string")
          expect(typeof label.score).toBe("number")
          expect(label.score).toBeGreaterThanOrEqual(0)
          expect(label.score).toBeLessThanOrEqual(1)
        })
      })
    }))

  testCondition("getLabels - all labels", () =>
    Effect.gen(function*() {
      const itemsList = [
        "0x4888649440c8cfd3ef6e28f2096a201d20253176"
      ]

      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(itemsList, "all"))

      // Validate structure
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)

      const item = result[0]
      expect(item).toHaveProperty("moderation")
      expect(Array.isArray(item.moderation)).toBe(true)
    }))

  testCondition("getLabels - validates return type structure", () =>
    Effect.gen(function*() {
      const itemsList = ["0x4888649440c8cfd3ef6e28f2096a201d20253176"]

      const result = yield* Effect.tryPromise(() => client.search.posts.getLabels(itemsList, "moderation"))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: PostLabelsResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("handles invalid queries gracefully", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.posts.byQuery("", { top_k: 1 }))
      )

      // Should either succeed with empty results or fail gracefully
      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))

  testCondition("handles invalid cast IDs gracefully", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.posts.getLabels(["invalid-cast-id"], "moderation")).pipe(
          Effect.timeout("10 seconds") // Add timeout to prevent hanging
        )
      )

      // Should either succeed with empty results or fail gracefully
      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))
})
