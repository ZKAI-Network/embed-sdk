import { describe, expect, it } from "@effect/vitest"
import type {
  UserLabelsResponse,
  UserSemanticSearchResponse,
  UserSimilarityResponse,
  UserTopByLabelResponse
} from "@embed-ai/types"
import { Effect, Exit } from "effect"
import { getClient } from "../src/index.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

describe("Search Users", () => {
  const client = getClient(apiKey!)

  testCondition("byQuery - basic semantic search", () =>
    Effect.gen(function*() {
      const query = "crypto web3 blockchain developers"
      const result = yield* Effect.tryPromise(() => client.search.users.byQuery(query, { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThanOrEqual(5)

      // Validate item structure
      const firstItem = result[0]
      expect(firstItem).toHaveProperty("user_id")
      expect(firstItem).toHaveProperty("score")
      expect(typeof firstItem.user_id).toBe("string")
      expect(typeof firstItem.score).toBe("number")
      expect(firstItem.score).toBeGreaterThan(0)
      expect(firstItem.score).toBeLessThanOrEqual(1)
    }))

  testCondition("byQuery - with custom top_k", () =>
    Effect.gen(function*() {
      const query = "artificial intelligence researchers"

      const result = yield* Effect.tryPromise(() =>
        client.search.users.byQuery(query, {
          top_k: 3
        })
      )

      // Validate structure
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.length).toBeLessThanOrEqual(3)

      if (result.length > 0) {
        const firstItem = result[0]
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
      }
    }))

  testCondition("byQuery - validates return type structure", () =>
    Effect.gen(function*() {
      const result = yield* Effect.tryPromise(() => client.search.users.byQuery("test query", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserSemanticSearchResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("similar - find similar users", () =>
    Effect.gen(function*() {
      const targetUserId = "16085" // Known user ID
      const result = yield* Effect.tryPromise(() => client.search.users.similar(targetUserId, { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.length).toBeLessThanOrEqual(5)

      if (result.length > 0) {
        const firstItem = result[0]
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThan(0)
        expect(firstItem.score).toBeLessThanOrEqual(1)
      }
    }))

  testCondition("similar - validates return type structure", () =>
    Effect.gen(function*() {
      const result = yield* Effect.tryPromise(() => client.search.users.similar("16085", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserSimilarityResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("getTopByLabel - get top users by label", () =>
    Effect.gen(function*() {
      const result = yield* Effect.tryPromise(() => client.search.users.getTopByLabel("positive", { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.length).toBeLessThanOrEqual(5)

      if (result.length > 0) {
        const firstItem = result[0]
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(firstItem).toHaveProperty("count")
        expect(firstItem).toHaveProperty("ratio")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(typeof firstItem.count).toBe("number")
        expect(typeof firstItem.ratio).toBe("number")
      }
    }))

  testCondition("getTopByLabel - validates return type structure", () =>
    Effect.gen(function*() {
      const result = yield* Effect.tryPromise(() => client.search.users.getTopByLabel("gaming", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserTopByLabelResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("getLabels - user AI labels", () =>
    Effect.gen(function*() {
      const usersList = ["16085", "602"] // Known user IDs

      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "all"))

      // Validate structure
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(usersList.length)

      // Validate each item structure
      result.forEach((item) => {
        expect(item).toHaveProperty("user_id")
        expect(item).toHaveProperty("ai_labels")
        expect(typeof item.user_id).toBe("string")

        const aiLabels = item.ai_labels
        expect(aiLabels).toHaveProperty("topics")
        expect(aiLabels).toHaveProperty("sentiment")
        expect(aiLabels).toHaveProperty("emotion")
        expect(aiLabels).toHaveProperty("moderation")

        // Validate label arrays
        expect(Array.isArray(aiLabels.topics)).toBe(true)
        expect(Array.isArray(aiLabels.sentiment)).toBe(true)
        expect(Array.isArray(aiLabels.emotion)).toBe(true)
        expect(Array.isArray(aiLabels.moderation)).toBe(true)

        // Validate label structure in each category
        aiLabels.topics.forEach((label) => {
          expect(label).toHaveProperty("label")
          expect(label).toHaveProperty("score")
          expect(typeof label.label).toBe("string")
          expect(typeof label.score).toBe("number")
        })
      })
    }))

  testCondition("getLabels - specific category", () =>
    Effect.gen(function*() {
      const usersList = ["16085"]

      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "topics"))

      // Validate structure
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)

      const user = result[0]
      expect(user).toHaveProperty("user_id")
      expect(user).toHaveProperty("ai_labels")
      expect(user.ai_labels).toHaveProperty("topics")
      expect(Array.isArray(user.ai_labels.topics)).toBe(true)
    }))

  testCondition("getLabels - validates return type structure", () =>
    Effect.gen(function*() {
      const usersList = ["16085"]

      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "all"))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserLabelsResponse = result
      expect(typedResult).toBeDefined()
    }))

  testCondition("handles invalid queries gracefully", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.byQuery("", { top_k: 1 }))
      )

      // Should either succeed with empty results or fail gracefully
      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))

  testCondition("handles invalid user IDs gracefully", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.similar("invalid-user-id", { top_k: 1 }))
      )

      // Should either succeed with empty results or fail gracefully
      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))

  testCondition("handles invalid labels gracefully", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.getLabels(["invalid-user-id"], "topics"))
      )

      // Should either succeed with empty results or fail gracefully
      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))
})
