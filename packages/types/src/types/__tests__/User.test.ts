import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { User } from "../User.js"

describe("User", () => {
  it("should validate minimal valid user", () => {
    const validUser = {
      user_id: "farcaster.alice123",
      protocol: "farcaster" as const,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    }

    const result = S.decodeUnknownSync(User)(validUser)
    expect(result).toEqual(validUser)
  })

  it("should validate user with all optional fields", () => {
    const fullUser = {
      user_id: "lens.creator456",
      protocol: "lens" as const,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      username: "creator456",
      display_name: "Content Creator",
      bio: "Web3 developer and content creator",
      email: "creator@example.com",
      avatar_url: "https://example.com/avatar.jpg",
      banner_url: "https://example.com/banner.jpg",
      website: "https://creator.example.com",
      location: "San Francisco",
      follower_count: 1250,
      following_count: 890,
      post_count: 45,
      verified: true,
      tags: ["developer", "web3", "creator"],
      preferences: { theme: "dark", notifications: true },
      metadata: { platform_specific: "data" }
    }

    const result = S.decodeUnknownSync(User)(fullUser)
    expect(result).toEqual(fullUser)
  })

  it("should validate all protocol values", () => {
    const protocols = ["farcaster", "mirror", "lens", "twitter", "instagram"] as const

    protocols.forEach((protocol) => {
      const validUser = {
        user_id: `${protocol}.user123`,
        protocol,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      }

      const result = S.decodeUnknownSync(User)(validUser)
      expect(result.protocol).toBe(protocol)
    })
  })

  it("should validate different user_id formats", () => {
    const userIds = [
      "farcaster.alice123",
      "lens.creator456",
      "mirror.writer321",
      "twitter.user_123",
      "instagram.influencer-456"
    ]

    userIds.forEach((user_id) => {
      const validUser = {
        user_id,
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      }

      const result = S.decodeUnknownSync(User)(validUser)
      expect(result.user_id).toBe(user_id)
    })
  })

  it("should validate various email formats", () => {
    const validEmails = [
      "user@example.com",
      "test.email+tag@domain.co.uk",
      "user_123@sub.domain.org",
      "name-with-dashes@example-domain.com"
    ]

    validEmails.forEach((email) => {
      const validUser = {
        user_id: "farcaster.user123",
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        email
      }

      const result = S.decodeUnknownSync(User)(validUser)
      expect(result.email).toBe(email)
    })
  })

  it("should validate various URL formats", () => {
    const validUrls = [
      "https://example.com",
      "http://example.com",
      "https://sub.domain.com/path?query=value",
      "http://example.com:8080/path"
    ]

    validUrls.forEach((avatar_url) => {
      const validUser = {
        user_id: "farcaster.user123",
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        avatar_url
      }

      const result = S.decodeUnknownSync(User)(validUser)
      expect(result.avatar_url).toBe(avatar_url)
    })
  })

  it("should reject missing required fields", () => {
    const invalidUsers = [
      { protocol: "farcaster", created_at: "2024-01-15T10:30:00Z", updated_at: "2024-01-15T10:30:00Z" },
      { user_id: "farcaster.user123", created_at: "2024-01-15T10:30:00Z", updated_at: "2024-01-15T10:30:00Z" },
      { user_id: "farcaster.user123", protocol: "farcaster", updated_at: "2024-01-15T10:30:00Z" },
      { user_id: "farcaster.user123", protocol: "farcaster", created_at: "2024-01-15T10:30:00Z" }
    ]

    invalidUsers.forEach((user) => {
      expect(() => S.decodeUnknownSync(User)(user)).toThrow()
    })
  })

  it("should reject invalid user_id format", () => {
    const invalidUserIds = [
      "invalid-format",
      "no-dot-here",
      "farcaster.",
      ".missing-protocol",
      "too.many.dots.here"
    ]

    invalidUserIds.forEach((user_id) => {
      const invalidUser = {
        user_id,
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      }

      expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
    })
  })

  it("should reject invalid protocol values", () => {
    const invalidUser = {
      user_id: "farcaster.user123",
      protocol: "invalid_protocol",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    }

    expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
  })

  it("should reject invalid ISO 8601 date format", () => {
    const invalidDates = [
      "2024-01-15",
      "2024-01-15T10:30:00",
      "not-a-date"
    ]

    invalidDates.forEach((created_at) => {
      const invalidUser = {
        user_id: "farcaster.user123",
        protocol: "farcaster" as const,
        created_at,
        updated_at: "2024-01-15T10:30:00Z"
      }

      expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
    })
  })

  it("should reject invalid email formats", () => {
    const invalidEmails = [
      "invalid-email",
      "@domain.com",
      "user@"
    ]

    invalidEmails.forEach((email) => {
      const invalidUser = {
        user_id: "farcaster.user123",
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        email
      }

      expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
    })
  })

  it("should reject invalid URL formats", () => {
    const invalidUrls = [
      "not-a-url",
      "ftp://example.com",
      "file:///local/path",
      "javascript:alert('xss')",
      "www.example.com"
    ]

    invalidUrls.forEach((website) => {
      const invalidUser = {
        user_id: "farcaster.user123",
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        website
      }

      expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
    })
  })

  it("should reject negative count values", () => {
    const invalidUser = {
      user_id: "farcaster.user123",
      protocol: "farcaster" as const,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      follower_count: -10
    }

    expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
  })

  it("should reject non-integer count values", () => {
    const invalidUser = {
      user_id: "farcaster.user123",
      protocol: "farcaster" as const,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      following_count: 3.14
    }

    expect(() => S.decodeUnknownSync(User)(invalidUser)).toThrow()
  })
})
