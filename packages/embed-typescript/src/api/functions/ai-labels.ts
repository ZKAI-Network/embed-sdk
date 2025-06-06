/**
 * AI Labels Functions
 *
 * Opinionated AI analysis functions with:
 * - Smart defaults for different analysis types
 * - Optimized for common content classification tasks
 * - Easy-to-use functions for sentiment, topics, and categories
 */

import type { LabelsForItems as LabelsForItemsType } from "../../types/LabelsForItems.js"
import type { LabelsForText as LabelsForTextType } from "../../types/LabelsForText.js"
import type { LabelsTopItems as LabelsTopItemsType } from "../../types/LabelsTopItems.js"
import { PublicApi } from "../api-registry.js"

/**
 * Analyze text content for topics and themes
 *
 * ✅ Optimized for topic detection
 * ✅ Perfect for content categorization
 * ✅ Useful for feed organization
 *
 * @param texts - Text content to analyze
 * @param options - Additional analysis options
 *
 * @example
 * ```typescript
 * // Analyze post topics
 * const topics = yield* analyzeTopics([
 *   "Building the future of decentralized finance",
 *   "New developments in blockchain scalability"
 * ])
 * ```
 */
export const analyzeTopics = (
  texts: Array<string>,
  options?: Partial<Omit<LabelsForTextType, "text_inputs" | "label_category">>
) =>
  PublicApi.LabelsForText({
    text_inputs: texts,
    label_category: "topics",
    ...options
  })

/**
 * Analyze sentiment of text content
 *
 * ✅ Detects positive, negative, neutral sentiment
 * ✅ Perfect for content moderation
 * ✅ Useful for engagement prediction
 *
 * @param texts - Text content to analyze
 * @param options - Additional analysis options
 *
 * @example
 * ```typescript
 * // Analyze post sentiment
 * const sentiment = yield* analyzeSentiment([
 *   "This is an amazing breakthrough!",
 *   "Not sure about this approach..."
 * ])
 * ```
 */
export const analyzeSentiment = (
  texts: Array<string>,
  options?: Partial<Omit<LabelsForTextType, "text_inputs" | "label_category">>
) =>
  PublicApi.LabelsForText({
    text_inputs: texts,
    label_category: "sentiment",
    ...options
  })

/**
 * Get content quality and safety labels
 *
 * ✅ Analyzes content quality indicators
 * ✅ Detects potential safety issues
 * ✅ Perfect for content moderation
 *
 * @param texts - Text content to analyze
 * @param options - Additional analysis options
 *
 * @example
 * ```typescript
 * // Check content quality
 * const quality = yield* analyzeContentQuality([
 *   "Detailed analysis of market trends...",
 *   "spam spam spam buy now!!!"
 * ])
 * ```
 */
export const analyzeContentQuality = (
  texts: Array<string>,
  options?: Partial<Omit<LabelsForTextType, "text_inputs" | "label_category">>
) =>
  PublicApi.LabelsForText({
    text_inputs: texts,
    label_category: "quality",
    ...options
  })

/**
 * Analyze content items for sentiment and engagement potential
 *
 * ✅ Gets AI labels for specific content items
 * ✅ Perfect for content curation
 * ✅ Useful for recommendation systems
 *
 * @param itemIds - Content item IDs to analyze
 * @param options - Additional analysis options
 *
 * @example
 * ```typescript
 * // Analyze specific posts
 * const itemLabels = yield* analyzeContentItems([
 *   "0x123abc...",
 *   "0x456def..."
 * ])
 * ```
 */
export const analyzeContentItems = (
  itemIds: Array<string>,
  options?: Partial<Omit<LabelsForItemsType, "items_list">>
) =>
  PublicApi.LabelsForItems({
    items_list: itemIds,
    label_category: "sentiment",
    ...options
  })

/**
 * Find top-performing content by AI label
 *
 * ✅ Discovers high-quality content by category
 * ✅ Perfect for content discovery
 * ✅ Useful for trending analysis
 *
 * @param label - AI label to search for
 * @param options - Additional search options
 *
 * @example
 * ```typescript
 * // Find top technology content
 * const topTech = yield* findTopContentByLabel("technology")
 *
 * // Find top positive sentiment content
 * const topPositive = yield* findTopContentByLabel("positive", {
 *   top_k: 30
 * })
 * ```
 */
export const findTopContentByLabel = (label: string, options?: Partial<Omit<LabelsTopItemsType, "label">>) =>
  PublicApi.LabelsTopItems({
    label,
    top_k: 20,
    ...options
  })

/**
 * Quick content classification for single text
 *
 * ✅ Simplified API for single text analysis
 * ✅ Returns comprehensive label set
 * ✅ Perfect for real-time classification
 *
 * @param text - Single text to classify
 * @param category - Analysis category (optional)
 *
 * @example
 * ```typescript
 * // Quick topic classification
 * const labels = yield* classifyText("This post is about DeFi innovation")
 *
 * // Sentiment analysis
 * const sentiment = yield* classifyText("Amazing project!", "sentiment")
 * ```
 */
export const classifyText = (
  text: string,
  category: "topics" | "sentiment" | "quality" = "topics"
) =>
  PublicApi.LabelsForText({
    text_inputs: [text],
    label_category: category
  })
