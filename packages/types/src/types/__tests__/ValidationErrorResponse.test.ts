import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { ValidationErrorResponse } from "../ValidationErrorResponse.js"

describe("ValidationErrorResponse", () => {
  it("should validate valid validation error response", () => {
    const validError = {
      error: "Validation failed",
      details: [
        "Missing required field: item_id",
        "Field timestamp should be int, got str",
        "Field item_id has invalid format. Expected format: ^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$"
      ]
    }

    const result = S.decodeUnknownSync(ValidationErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should validate with single detail", () => {
    const validError = {
      error: "Validation failed",
      details: ["Missing required field: user_id"]
    }

    const result = S.decodeUnknownSync(ValidationErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should validate with empty details array", () => {
    const validError = {
      error: "Validation failed",
      details: []
    }

    const result = S.decodeUnknownSync(ValidationErrorResponse)(validError)
    expect(result).toEqual(validError)
  })

  it("should reject missing error field", () => {
    const invalidError = {
      details: ["Some validation error"]
    }

    expect(() => S.decodeUnknownSync(ValidationErrorResponse)(invalidError)).toThrow()
  })

  it("should reject missing details field", () => {
    const invalidError = {
      error: "Validation failed"
    }

    expect(() => S.decodeUnknownSync(ValidationErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-string error", () => {
    const invalidError = {
      error: 123,
      details: ["Some detail"]
    }

    expect(() => S.decodeUnknownSync(ValidationErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-array details", () => {
    const invalidError = {
      error: "Validation failed",
      details: "not an array"
    }

    expect(() => S.decodeUnknownSync(ValidationErrorResponse)(invalidError)).toThrow()
  })

  it("should reject non-string items in details array", () => {
    const invalidError = {
      error: "Validation failed",
      details: ["valid string", 123, "another valid string"]
    }

    expect(() => S.decodeUnknownSync(ValidationErrorResponse)(invalidError)).toThrow()
  })
})
