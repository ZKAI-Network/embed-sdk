import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { Interaction } from "../Interaction.js"

describe("Interaction", () => {
  it("should validate user interaction", () => {
    const validUserInteraction = {
      item_id: "farcaster.0xabc123",
      timestamp: 1705312200,
      event_type: "like" as const,
      user_id: "farcaster.alice123"
    }

    const result = S.decodeUnknownSync(Interaction)(validUserInteraction)
    expect(result).toEqual(validUserInteraction)
  })

  it("should validate session interaction", () => {
    const validSessionInteraction = {
      item_id: "lens.post456",
      timestamp: 1705312800,
      event_type: "view" as const,
      session_id: "sess_anonymous_xyz789"
    }

    const result = S.decodeUnknownSync(Interaction)(validSessionInteraction)
    expect(result).toEqual(validSessionInteraction)
  })

  it("should validate all event types", () => {
    const eventTypes = ["view", "like", "comment", "share", "bookmark"] as const

    eventTypes.forEach((event_type) => {
      const validInteraction = {
        item_id: "farcaster.0xtest",
        timestamp: 1705312200,
        event_type,
        user_id: "farcaster.user123"
      }

      const result = S.decodeUnknownSync(Interaction)(validInteraction)
      expect(result.event_type).toBe(event_type)
    })
  })

  it("should validate different protocols in item_id", () => {
    const itemIds = [
      "farcaster.0xabc123",
      "lens.post456",
      "mirror.article789",
      "protocol_123.item_456"
    ]

    itemIds.forEach((item_id) => {
      const validInteraction = {
        item_id,
        timestamp: 1705312200,
        event_type: "view" as const,
        user_id: "farcaster.user123"
      }

      const result = S.decodeUnknownSync(Interaction)(validInteraction)
      expect(result.item_id).toBe(item_id)
    })
  })

  it("should validate different protocols in user_id", () => {
    const userIds = [
      "farcaster.alice123",
      "lens.creator456",
      "mirror.writer321",
      "protocol_test.user_123"
    ]

    userIds.forEach((user_id) => {
      const validInteraction = {
        item_id: "farcaster.0xtest",
        timestamp: 1705312200,
        event_type: "view" as const,
        user_id
      }

      const result = S.decodeUnknownSync(Interaction)(validInteraction)
      expect(result.user_id).toBe(user_id)
    })
  })

  it("should reject missing required fields", () => {
    const invalidInteractions = [
      { timestamp: 1705312200, event_type: "view", user_id: "farcaster.user123" },
      { item_id: "farcaster.0xtest", event_type: "view", user_id: "farcaster.user123" },
      { item_id: "farcaster.0xtest", timestamp: 1705312200, user_id: "farcaster.user123" },
      { item_id: "farcaster.0xtest", timestamp: 1705312200, event_type: "view" }
    ]

    invalidInteractions.forEach((interaction) => {
      expect(() => S.decodeUnknownSync(Interaction)(interaction)).toThrow()
    })
  })

  it("should reject invalid item_id format", () => {
    const invalidItemIds = [
      "invalid-format",
      "no-dot-here",
      "farcaster.",
      ".missing-protocol",
      "farcaster.item.extra.dots"
    ]

    invalidItemIds.forEach((item_id) => {
      const invalidInteraction = {
        item_id,
        timestamp: 1705312200,
        event_type: "view" as const,
        user_id: "farcaster.user123"
      }

      expect(() => S.decodeUnknownSync(Interaction)(invalidInteraction)).toThrow()
    })
  })

  it("should reject invalid user_id format", () => {
    const invalidUserIds = [
      "invalid-format",
      "no-dot-here",
      "farcaster.",
      ".missing-protocol"
    ]

    invalidUserIds.forEach((user_id) => {
      const invalidInteraction = {
        item_id: "farcaster.0xtest",
        timestamp: 1705312200,
        event_type: "view" as const,
        user_id
      }

      expect(() => S.decodeUnknownSync(Interaction)(invalidInteraction)).toThrow()
    })
  })

  it("should reject invalid event_type", () => {
    const invalidInteraction = {
      item_id: "farcaster.0xtest",
      timestamp: 1705312200,
      event_type: "invalid_event",
      user_id: "farcaster.user123"
    }

    expect(() => S.decodeUnknownSync(Interaction)(invalidInteraction)).toThrow()
  })

  it("should reject non-integer timestamp", () => {
    const invalidInteraction = {
      item_id: "farcaster.0xtest",
      timestamp: 1705312200.5,
      event_type: "view" as const,
      user_id: "farcaster.user123"
    }

    expect(() => S.decodeUnknownSync(Interaction)(invalidInteraction)).toThrow()
  })

  // Note: Union schema allows both user_id and session_id to be present
  // The schema will match against UserInteraction if user_id is present
})
