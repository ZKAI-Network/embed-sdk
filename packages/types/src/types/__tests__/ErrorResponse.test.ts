import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { ErrorResponse } from "../ErrorResponse.js"

describe("ErrorResponse", () => {
  it("should validate basic error response", () => {
    const validError = {
      error: "Something went wrong"
    }

    const result = S.decodeUnknownSync(ErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should validate error with details", () => {
    const validError = {
      error: "Validation failed",
      details: ["Missing required field: item_id", "Invalid format for timestamp"]
    }

    const result = S.decodeUnknownSync(ErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should validate error with debug info", () => {
    const validError = {
      error: "Internal server error",
      debug_info: {
        stack_trace: "Error at line 123",
        request_id: "req_123456"
      }
    }

    const result = S.decodeUnknownSync(ErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should validate error with all optional fields", () => {
    const validError = {
      error: "Complex error",
      details: ["Detail 1", "Detail 2"],
      debug_info: {
        trace: "some trace info"
      }
    }

    const result = S.decodeUnknownSync(ErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should reject missing error field", () => {
    const invalidError = {
      details: ["Some detail"]
    }

    expect(() => S.decodeUnknownSync(ErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-string error", () => {
    const invalidError = {
      error: 123
    }

    expect(() => S.decodeUnknownSync(ErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-array details", () => {
    const invalidError = {
      error: "Error message",
      details: "not an array"
    }

    expect(() => S.decodeUnknownSync(ErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-string items in details array", () => {
    const invalidError = {
      error: "Error message",
      details: ["valid string", 123, "another valid string"]
    }

    expect(() => S.decodeUnknownSync(ErrorResponse)(invalidError)).toThrow()
  })
})
