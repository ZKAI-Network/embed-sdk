/**
 * API Functions Index
 *
 * Exports all API functions organized by category.
 * These functions provide opinionated defaults and prevent common errors.
 */

// Feed functions
export {
  getForYouByUserId,
  getForYouByWallet,
  getPersonalizedFeedWithDiversity,
  getPopularNow,
  getTrendingNow
} from "./feeds.js"

// Search functions
export { deepSearch, quickSearch, searchWithAI } from "./search.js"

// User functions
export { discoverUsers, findPowerUsers, getChannelActiveUsers, quickUserSearch } from "./users.js"

// AI Labels functions
export {
  analyzeContentItems,
  analyzeContentQuality,
  analyzeSentiment,
  analyzeTopics,
  classifyText,
  findTopContentByLabel
} from "./ai-labels.js"
