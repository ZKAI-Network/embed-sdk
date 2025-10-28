import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { IngestionResponse } from "../IngestionResponse.js"

describe("IngestionResponse", () => {
  it("should validate single record response", () => {
    const validResponse = {
      message: "Data ingested successfully",
      stream_name: "datasource-e07d2ec0-643a.items",
      sequence_number: "49610918017569739920569266808940816015796745953697128450"
    }

    const result = S.decodeUnknownSync(IngestionResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should validate bulk records response", () => {
    const validResponse = {
      message: "Data ingested successfully",
      stream_name: "datasource-e07d2ec0-643a.items",
      total_records: 2,
      successful_records: 2,
      failed_records: 0
    }

    const result = S.decodeUnknownSync(IngestionResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should validate minimal response (required fields only)", () => {
    const validResponse = {
      message: "Data ingested successfully",
      stream_name: "datasource-test-123.users"
    }

    const result = S.decodeUnknownSync(IngestionResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should validate with all fields", () => {
    const validResponse = {
      message: "Bulk data ingested successfully",
      stream_name: "datasource-abc123-def456.interactions",
      sequence_number: "12345678901234567890",
      total_records: 10,
      successful_records: 8,
      failed_records: 2
    }

    const result = S.decodeUnknownSync(IngestionResponse)(validResponse)
    expect(result).toEqual(validResponse)
  })

  it("should reject missing required fields", () => {
    const invalidResponses = [
      { stream_name: "datasource-test.items" },
      { message: "Success" },
      {}
    ]

    invalidResponses.forEach((response) => {
      expect(() => S.decodeUnknownSync(IngestionResponse)(response)).toThrow()
    })
  })

  it("should reject non-string message", () => {
    const invalidResponse = {
      message: 123,
      stream_name: "datasource-test.items"
    }

    expect(() => S.decodeUnknownSync(IngestionResponse)(invalidResponse)).toThrow()
  })

  it("should reject non-string stream_name", () => {
    const invalidResponse = {
      message: "Success",
      stream_name: 123
    }

    expect(() => S.decodeUnknownSync(IngestionResponse)(invalidResponse)).toThrow()
  })

  it("should reject negative integer values", () => {
    const invalidResponses = [
      {
        message: "Success",
        stream_name: "test",
        total_records: -1
      },
      {
        message: "Success",
        stream_name: "test",
        successful_records: -5
      },
      {
        message: "Success",
        stream_name: "test",
        failed_records: -2
      }
    ]

    invalidResponses.forEach((response) => {
      expect(() => S.decodeUnknownSync(IngestionResponse)(response)).toThrow()
    })
  })

  it("should reject non-integer numeric values", () => {
    const invalidResponse = {
      message: "Success",
      stream_name: "test",
      total_records: 3.14
    }

    expect(() => S.decodeUnknownSync(IngestionResponse)(invalidResponse)).toThrow()
  })
})
