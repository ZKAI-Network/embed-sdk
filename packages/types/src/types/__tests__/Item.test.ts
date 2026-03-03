import * as S from "effect/Schema"
import { describe, expect, it } from "vitest"
import { Item } from "../Item.js"

describe("Item", () => {
  it("should validate minimal valid item", () => {
    const validItem = {
      item_id: "farcaster.0xabc123",
      protocol: "farcaster" as const,
      author_id: "farcaster.alice123",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      publication_type: "frame" as const,
      root_item_id: "farcaster.0xabc123",
      language_score: 0.95
    }

    const result = S.decodeUnknownSync(Item)(validItem)
    expect(result).toEqual(validItem)
  })

  it("should validate item with all optional fields", () => {
    const fullItem = {
      item_id: "lens.post123",
      protocol: "lens" as const,
      author_id: "lens.creator456",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      publication_type: "image" as const,
      root_item_id: "lens.post123",
      language_score: 0.98,
      title: "Beautiful Sunset",
      content: "Check out this amazing sunset photo I captured!",
      excerpt: "A stunning sunset photograph",
      tags: ["photography", "nature", "sunset"],
      language: "en" as const,
      image_urls: ["https://example.com/sunset.jpg"],
      video_url: "https://example.com/video.mp4",
      audio_url: "https://example.com/audio.mp3",
      cover_image_url: "https://example.com/cover.jpg",
      thumbnail_url: "https://example.com/thumb.jpg",
      view_count: 1000,
      like_count: 42,
      comment_count: 5,
      share_count: 10,
      bookmark_count: 3,
      word_count: 25,
      read_time_minutes: 1,
      is_published: true,
      is_featured: false,
      is_pinned: false,
      source_url: "https://example.com/original",
      canonical_url: "https://example.com/canonical",
      location: "San Francisco, CA",
      metadata: { custom_field: "value" },
      custom_fields: { app_specific: "data" }
    }

    const result = S.decodeUnknownSync(Item)(fullItem)
    expect(result).toEqual(fullItem)
  })

  it("should validate all protocol values", () => {
    const protocols = ["farcaster", "mirror", "lens"] as const

    protocols.forEach((protocol) => {
      const validItem = {
        item_id: `${protocol}.item123`,
        protocol,
        author_id: `${protocol}.author123`,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: `${protocol}.item123`,
        language_score: 0.9
      }

      const result = S.decodeUnknownSync(Item)(validItem)
      expect(result.protocol).toBe(protocol)
    })
  })

  it("should validate all publication_type values", () => {
    const publicationTypes = ["text_only", "frame", "article", "image", "video", "audio"] as const

    publicationTypes.forEach((publication_type) => {
      const validItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9
      }

      const result = S.decodeUnknownSync(Item)(validItem)
      expect(result.publication_type).toBe(publication_type)
    })
  })

  it("should validate all language values", () => {
    const languages = ["en", "es", "fr", "de", "pt", "it", "ja", "ko", "zh", "ru", "ar"] as const

    languages.forEach((language) => {
      const validItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9,
        language
      }

      const result = S.decodeUnknownSync(Item)(validItem)
      expect(result.language).toBe(language)
    })
  })

  it("should reject invalid item_id format", () => {
    const invalidItemIds = [
      "invalid-format",
      "no-dot-here",
      "farcaster.",
      ".missing-protocol"
    ]

    invalidItemIds.forEach((item_id) => {
      const invalidItem = {
        item_id,
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9
      }

      expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
    })
  })

  it("should reject invalid author_id format", () => {
    const invalidAuthorIds = [
      "invalid-format",
      "no-dot-here",
      "farcaster.",
      ".missing-protocol"
    ]

    invalidAuthorIds.forEach((author_id) => {
      const invalidItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9
      }

      expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
    })
  })

  it("should reject invalid ISO 8601 date format", () => {
    const invalidDates = [
      "2024-01-15",
      "2024-01-15T10:30:00",
      "not-a-date"
    ]

    invalidDates.forEach((created_at) => {
      const invalidItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at,
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9
      }

      expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
    })
  })

  it("should reject language_score outside 0-1 range", () => {
    const invalidScores = [-0.1, 1.1, 2.0, -1.0]

    invalidScores.forEach((language_score) => {
      const invalidItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "text_only" as const,
        root_item_id: "farcaster.0xtest",
        language_score
      }

      expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
    })
  })

  it("should reject invalid URL formats", () => {
    const invalidUrls = [
      "not-a-url",
      "ftp://example.com",
      "file:///local/path",
      "javascript:alert('xss')"
    ]

    invalidUrls.forEach((video_url) => {
      const invalidItem = {
        item_id: "farcaster.0xtest",
        protocol: "farcaster" as const,
        author_id: "farcaster.author123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "video" as const,
        root_item_id: "farcaster.0xtest",
        language_score: 0.9,
        video_url
      }

      expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
    })
  })

  it("should reject negative count values", () => {
    const invalidItem = {
      item_id: "farcaster.0xtest",
      protocol: "farcaster" as const,
      author_id: "farcaster.author123",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      publication_type: "text_only" as const,
      root_item_id: "farcaster.0xtest",
      language_score: 0.9,
      like_count: -5
    }

    expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
  })

  it("should reject non-integer count values", () => {
    const invalidItem = {
      item_id: "farcaster.0xtest",
      protocol: "farcaster" as const,
      author_id: "farcaster.author123",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      publication_type: "text_only" as const,
      root_item_id: "farcaster.0xtest",
      language_score: 0.9,
      view_count: 3.14
    }

    expect(() => S.decodeUnknownSync(Item)(invalidItem)).toThrow()
  })
})
