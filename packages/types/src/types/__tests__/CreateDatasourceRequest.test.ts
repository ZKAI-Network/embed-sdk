import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { CreateDatasourceRequest } from "../CreateDatasourceRequest.js"

describe("CreateDatasourceRequest", () => {
  it("should validate a valid request with name", () => {
    const validRequest = {
      name: "my-web3-app"
    }

    const result = S.decodeUnknownSync(CreateDatasourceRequest)(validRequest)
    expect(result).toEqual(validRequest)
  })

  it("should validate an empty request", () => {
    const emptyRequest = {}

    const result = S.decodeUnknownSync(CreateDatasourceRequest)(emptyRequest)
    expect(result).toEqual({})
  })

  it("should validate request with optional name", () => {
    const requestWithUndefinedName = {
      name: undefined
    }

    const result = S.decodeUnknownSync(CreateDatasourceRequest)(requestWithUndefinedName)
    expect(result).toEqual({})
  })

  it("should reject name longer than 255 characters", () => {
    const longName = "a".repeat(256)
    const invalidRequest = {
      name: longName
    }

    expect(() => S.decodeUnknownSync(CreateDatasourceRequest)(invalidRequest)).toThrow()
  })

  it("should accept name at max length (255 characters)", () => {
    const maxLengthName = "a".repeat(255)
    const validRequest = {
      name: maxLengthName
    }

    const result = S.decodeUnknownSync(CreateDatasourceRequest)(validRequest)
    expect(result).toEqual(validRequest)
  })

  it("should reject non-string name", () => {
    const invalidRequest = {
      name: 123
    }

    expect(() => S.decodeUnknownSync(CreateDatasourceRequest)(invalidRequest)).toThrow()
  })

  // Note: Effect Schema allows additional properties by default
  // This test is removed as the schema doesn't explicitly forbid extra properties
})
