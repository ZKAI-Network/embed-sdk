import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { CreateDatasourceResponse } from "../CreateDatasourceResponse.js"

describe("CreateDatasourceResponse", () => {
  it("should validate a complete valid response", () => {
    const validResponse = {
      datasource_id: "datasource-e07d2ec0-643a",
      customer_id: "e07d2ec0643a4f8b9c1d2e3f4a5b6c7d8e9f0a1b",
      status: "provisioning" as const,
      name: "my-web3-app"
    }

    const result = S.decodeUnknownSync(CreateDatasourceResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should validate response without optional name", () => {
    const validResponse = {
      datasource_id: "datasource-abc123-def456",
      customer_id: "customer123456789",
      status: "active" as const
    }

    const result = S.decodeUnknownSync(CreateDatasourceResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should validate all valid status values", () => {
    const statuses = ["provisioning", "active", "error"] as const

    statuses.forEach((status) => {
      const validResponse = {
        datasource_id: "datasource-test-123",
        customer_id: "customer123",
        status
      }

      const result = S.decodeUnknownSync(CreateDatasourceResponse)(validResponse)
      expect(result.status).toBe(status)
    })
  })

  it("should reject invalid datasource_id format", () => {
    const invalidResponses = [
      {
        datasource_id: "invalid-format",
        customer_id: "customer123",
        status: "active" as const
      },
      {
        datasource_id: "datasource-",
        customer_id: "customer123",
        status: "active" as const
      },
      {
        datasource_id: "datasource-abc",
        customer_id: "customer123",
        status: "active" as const
      }
    ]

    invalidResponses.forEach((response) => {
      expect(() => S.decodeUnknownSync(CreateDatasourceResponse)(response)).toThrow()
    })
  })

  it("should reject invalid status values", () => {
    const invalidResponse = {
      datasource_id: "datasource-test-123",
      customer_id: "customer123",
      status: "invalid-status"
    }

    expect(() => S.decodeUnknownSync(CreateDatasourceResponse)(invalidResponse)).toThrow()
  })

  it("should reject missing required fields", () => {
    const invalidResponses = [
      { customer_id: "customer123", status: "active" },
      { datasource_id: "datasource-test-123", status: "active" },
      { datasource_id: "datasource-test-123", customer_id: "customer123" }
    ]

    invalidResponses.forEach((response) => {
      expect(() => S.decodeUnknownSync(CreateDatasourceResponse)(response)).toThrow()
    })
  })
})
