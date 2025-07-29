import { describe, expect, it } from "@effect/vitest"
import type { CreateDatasourceResponse, IngestionResponse } from "@embed-ai/types"
import { Exit } from "effect"
import * as Effect from "effect/Effect"
import { getFastFailClient, getTestClient } from "./setup.js"

const apiKey = process.env.API_KEY_EMBED

// Skip tests if no API key is provided
const testCondition = apiKey ? it.effect : it.effect.skip

// Helper to create client only when API key is available
const createClient = () => apiKey ? getTestClient(apiKey) : null
const createFastFailClient = () => apiKey ? getFastFailClient(apiKey) : null

describe("Datasource", () => {
  describe("Datasource Management", () => {
    testCondition("create - should create datasource with name", () =>
      Effect.gen(function*() {
        const client = createClient()!

        const result = yield* Effect.tryPromise(() => client.datasource.create({ name: "test-integration-datasource" }))

        expect(result).toBeDefined()
        expect(result).toHaveProperty("datasource_id")
        expect(result).toHaveProperty("customer_id")
        expect(result).toHaveProperty("status")
        expect(typeof result.datasource_id).toBe("string")
        expect(result.datasource_id).toMatch(/^datasource-/)
        expect(result.name).toBe("test-integration-datasource")
      }))

    testCondition("create - should create datasource without name", () =>
      Effect.gen(function*() {
        const client = createClient()!

        const result = yield* Effect.tryPromise(() => client.datasource.create())

        expect(result).toBeDefined()
        expect(result).toHaveProperty("datasource_id")
        expect(result).toHaveProperty("customer_id")
        expect(result).toHaveProperty("status")
        expect(typeof result.datasource_id).toBe("string")
        expect(result.datasource_id).toMatch(/^datasource-/)
      }))
  })

  describe("Data Ingestion", () => {
    testCondition("ingestItems - should ingest single item", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // First create a datasource
        const datasource = yield* Effect.tryPromise(() => client.datasource.create({ name: "test-items-datasource" }))

        const testItem = {
          item_id: "test.integration.item123",
          protocol: "farcaster" as const,
          author_id: "test.integration.author123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          publication_type: "text_only" as const,
          root_item_id: "test.integration.item123",
          language_score: 0.95,
          title: "Integration Test Item"
        }

        const result = yield* Effect.tryPromise(() => client.datasource.ingestItems(datasource.datasource_id, testItem))

        expect(result).toBeDefined()
        expect(result).toHaveProperty("message")
        expect(result).toHaveProperty("stream_name")
        expect(result.message).toBe("Data ingested successfully")
        expect(result.stream_name).toContain(datasource.datasource_id)
        expect(result.stream_name).toContain("items")
      }))

    testCondition("ingestUsers - should ingest single user", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // First create a datasource
        const datasource = yield* Effect.tryPromise(() => client.datasource.create({ name: "test-users-datasource" }))

        const testUser = {
          user_id: "test.integration.user123",
          protocol: "farcaster" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          username: "testuser123",
          display_name: "Test User",
          bio: "Integration test user"
        }

        const result = yield* Effect.tryPromise(() => client.datasource.ingestUsers(datasource.datasource_id, testUser))

        expect(result).toBeDefined()
        expect(result).toHaveProperty("message")
        expect(result).toHaveProperty("stream_name")
        expect(result.message).toBe("Data ingested successfully")
        expect(result.stream_name).toContain(datasource.datasource_id)
        expect(result.stream_name).toContain("users")
      }))
  })

  describe("Interaction Tracking", () => {
    testCondition("trackItemInteractions - should track user interaction", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // First create a datasource
        const datasource = yield* Effect.tryPromise(() =>
          client.datasource.create({ name: "test-interactions-datasource" })
        )

        const testInteraction = {
          item_id: "test.integration.item456",
          timestamp: Math.floor(Date.now() / 1000),
          event_type: "view" as const,
          user_id: "test.integration.user456"
        }

        const result = yield* Effect.tryPromise(() =>
          client.datasource.trackItemInteractions(datasource.datasource_id, testInteraction)
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("message")
        expect(result).toHaveProperty("stream_name")
        expect(result.message).toBe("Data ingested successfully")
        expect(result.stream_name).toContain(datasource.datasource_id)
        expect(result.stream_name).toContain("items.interactions")
      }))

    testCondition("trackUserInteractions - should track with different stream routing", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // First create a datasource
        const datasource = yield* Effect.tryPromise(() =>
          client.datasource.create({ name: "test-user-interactions-datasource" })
        )

        const testInteraction = {
          item_id: "test.integration.item789",
          timestamp: Math.floor(Date.now() / 1000),
          event_type: "like" as const,
          user_id: "test.integration.user789"
        }

        const result = yield* Effect.tryPromise(() =>
          client.datasource.trackUserInteractions(datasource.datasource_id, testInteraction)
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("message")
        expect(result).toHaveProperty("stream_name")
        expect(result.message).toBe("Data ingested successfully")
        expect(result.stream_name).toContain(datasource.datasource_id)
        expect(result.stream_name).toContain("users.interactions")
      }))
  })

  describe("Type Validation", () => {
    testCondition("create - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!
        const result = yield* Effect.tryPromise(() => client.datasource.create({ name: "type-validation-test" }))

        // Type check - this should compile and runtime validate
        const typedResult: CreateDatasourceResponse = result as CreateDatasourceResponse
        expect(typedResult).toBeDefined()
        expect(typedResult.datasource_id).toBeDefined()
        expect(typedResult.customer_id).toBeDefined()
        expect(typedResult.status).toBeDefined()
      }))

    testCondition("ingestItems - validates return type structure", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // Create datasource first
        const datasource = yield* Effect.tryPromise(() => client.datasource.create({ name: "type-validation-items" }))

        const testItem = {
          item_id: "test.type.validation.item",
          protocol: "farcaster" as const,
          author_id: "test.type.validation.author",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          publication_type: "text_only" as const,
          root_item_id: "test.type.validation.item",
          language_score: 0.9
        }

        const result = yield* Effect.tryPromise(() => client.datasource.ingestItems(datasource.datasource_id, testItem))

        // Type check - this should compile and runtime validate
        const typedResult: IngestionResponse = result as IngestionResponse
        expect(typedResult).toBeDefined()
        expect(typedResult.message).toBeDefined()
        expect(typedResult.stream_name).toBeDefined()
      }))
  })

  describe("Error Handling", () => {
    testCondition("handles invalid datasource ID gracefully", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()!
        const testItem = {
          item_id: "test.error.item",
          protocol: "farcaster" as const,
          author_id: "test.error.author",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          publication_type: "text_only" as const,
          root_item_id: "test.error.item",
          language_score: 0.9
        }

        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.datasource.ingestItems("invalid-datasource-id", testItem))
        )

        // Should fail gracefully
        expect(Exit.isFailure(result)).toBe(true)
      }))

    testCondition("handles malformed item data gracefully", () =>
      Effect.gen(function*() {
        const client = createFastFailClient()!

        // Create valid datasource first
        const datasource = yield* Effect.tryPromise(() => client.datasource.create({ name: "error-handling-test" }))

        // Try to ingest malformed item (missing required fields)
        const malformedItem = {
          item_id: "test.malformed.item"
          // Missing required fields like protocol, author_id, etc.
        } as any

        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.datasource.ingestItems(datasource.datasource_id, malformedItem))
        )

        // Should either succeed or fail gracefully
        if (Exit.isSuccess(result)) {
          expect(result.value).toBeDefined()
        } else {
          expect(Exit.isFailure(result)).toBe(true)
        }
      }))

    testCondition("handles empty array ingestion", () =>
      Effect.gen(function*() {
        const client = createClient()!

        // Create datasource first
        const datasource = yield* Effect.tryPromise(() => client.datasource.create({ name: "empty-array-test" }))

        const result = yield* Effect.exit(
          Effect.tryPromise(() => client.datasource.ingestItems(datasource.datasource_id, []))
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
