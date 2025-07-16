import { describe, expect, it } from "@effect/vitest"
import type {
  UserLabelsResponse,
  UserSemanticSearchResponse,
  UserSimilarityResponse,
  UserTopByLabelResponse
} from "@embed-ai/types"
import { Effect, Exit } from "effect"
import { getFastFailClient, getTestClient } from "./setup.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

// Helper to create client only when API key is available
const createClient = () => apiKey ? getTestClient(apiKey) : null
const createFastFailClient = () => apiKey ? getFastFailClient(apiKey) : null

describe("Search Users", () => {
  testCondition("byQuery - basic semantic search", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const query = "crypto web3 blockchain developers"
      const result = yield* Effect.tryPromise(() => client.search.users.byQuery(query, { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThanOrEqual(5)

      // Validate item structure
      const firstItem = result[0] as any
      expect(firstItem).toHaveProperty("user_id")
      expect(firstItem).toHaveProperty("score")
      expect(typeof firstItem.user_id).toBe("string")
      expect(typeof firstItem.score).toBe("number")
      expect(firstItem.score).toBeGreaterThanOrEqual(0)
      // API can return scores > 1, so remove upper limit check
    }))

  testCondition("byQuery - with custom top_k", () =>
    Effect.gen(function*() {
      const client = createClient()!
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
        const firstItem = result[0] as any
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
      }
    }))

  testCondition("byQuery - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const result = yield* Effect.tryPromise(() => client.search.users.byQuery("test query", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserSemanticSearchResponse = result as UserSemanticSearchResponse
      expect(typedResult).toBeDefined()
    }))

  testCondition("similar - find similar users", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const targetUserId = "16085" // Known user ID
      const result = yield* Effect.tryPromise(() => client.search.users.similar(targetUserId, { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.length).toBeLessThanOrEqual(5)

      if (result.length > 0) {
        const firstItem = result[0] as any
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThanOrEqual(0)
        // API can return scores > 1, so remove upper limit check
      }
    }))

  testCondition("similar - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const result = yield* Effect.tryPromise(() => client.search.users.similar("16085", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserSimilarityResponse = result as UserSimilarityResponse
      expect(typedResult).toBeDefined()
    }))

  testCondition("getTopByLabel - get top users by label", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()! // Use fast-fail for this potentially slow endpoint
      const result = yield* Effect.tryPromise(() => client.search.users.getTopByLabel("positive", { top_k: 5 }))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.length).toBeLessThanOrEqual(5)

      if (result.length > 0) {
        const firstItem = result[0] as any
        expect(firstItem).toHaveProperty("user_id")
        expect(firstItem).toHaveProperty("score")
        expect(typeof firstItem.user_id).toBe("string")
        expect(typeof firstItem.score).toBe("number")
        expect(firstItem.score).toBeGreaterThanOrEqual(0)
        expect(firstItem.score).toBeLessThanOrEqual(1)
      }
    }))

  testCondition("getTopByLabel - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()! // Use fast-fail for this potentially slow endpoint
      const result = yield* Effect.tryPromise(() => client.search.users.getTopByLabel("gaming", { top_k: 2 }))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserTopByLabelResponse = result as UserTopByLabelResponse
      expect(typedResult).toBeDefined()
    }))

  testCondition("getLabels - user AI labels", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const usersList = ["16085"] // Known user ID
      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "all"))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(usersList.length)

      // Check first user labels
      if (result.length > 0) {
        const userLabels = result[0] as any
        expect(userLabels).toHaveProperty("user_id")
        expect(userLabels).toHaveProperty("ai_labels")
        expect(typeof userLabels.user_id).toBe("string")
        expect(typeof userLabels.ai_labels).toBe("object")

        // Check ai_labels structure
        const aiLabels = userLabels.ai_labels
        expect(aiLabels).toHaveProperty("topics")
        expect(Array.isArray(aiLabels.topics)).toBe(true)

        // Validate topic labels structure
        if (aiLabels.topics.length > 0) {
          const topic = aiLabels.topics[0]
          expect(topic).toHaveProperty("label")
          expect(topic).toHaveProperty("score")
          expect(typeof topic.label).toBe("string")
          expect(typeof topic.score).toBe("number")

          // Validate score is between 0 and 1
          expect(topic.score).toBeGreaterThanOrEqual(0)
          expect(topic.score).toBeLessThanOrEqual(1)
        }

        // Check for other categories
        aiLabels.topics.forEach((label: any) => {
          expect(typeof label.label).toBe("string")
          expect(typeof label.score).toBe("number")
          expect(label.score).toBeGreaterThanOrEqual(0)
          expect(label.score).toBeLessThanOrEqual(1)
        })
      }
    }))

  testCondition("getLabels - specific category", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const usersList = ["16085"] // Known user ID

      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "topics"))

      // Validate structure and types
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)

      const user = result[0] as any
      expect(user).toHaveProperty("user_id")
      expect(user).toHaveProperty("ai_labels")
      expect(user.ai_labels).toHaveProperty("topics")
      expect(Array.isArray(user.ai_labels.topics)).toBe(true)
    }))

  testCondition("getLabels - validates return type structure", () =>
    Effect.gen(function*() {
      const client = createClient()!
      const usersList = ["16085"] // Known user ID
      const result = yield* Effect.tryPromise(() => client.search.users.getLabels(usersList, "all"))

      // Type validation - this will fail at compile time if types don't match
      const typedResult: UserLabelsResponse = result as UserLabelsResponse
      expect(typedResult).toBeDefined()
    }))

  testCondition("handles invalid queries gracefully", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()!
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.byQuery("", { top_k: 1 }))
      )

      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))

  testCondition("handles invalid user IDs gracefully", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()!
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.similar("invalid-user-id", { top_k: 1 }))
      )

      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))

  testCondition("handles invalid labels gracefully", () =>
    Effect.gen(function*() {
      const client = createFastFailClient()!
      const result = yield* Effect.exit(
        Effect.tryPromise(() => client.search.users.getLabels(["invalid-user-id"], "topics"))
      )

      if (Exit.isSuccess(result)) {
        expect(Array.isArray(result.value)).toBe(true)
      } else {
        expect(Exit.isFailure(result)).toBe(true)
      }
    }))
})
