export const FEEDS = [
  {
    id: "feed_388",
    name: "Trending",
    description: "A feed of content that is quickly gaining traction across the FC social graph."
  },
  {
    id: "feed_390",
    name: "For You",
    description: "This is a for you feed that works particularly well with users who have an FID."
  },
  {
    id: "feed_624",
    name: "Zora Feed",
    description: "A curated feed featuring content from the Zora ecosystem."
  },
  {
    id: "feed_625",
    name: "Short Form Video",
    description: "A feed focused on short-form video content and multimedia posts."
  },
  {
    id: "feed_626",
    name: "Miniapps",
    description: "A feed showcasing content related to miniapps and decentralized applications."
  },
  {
    id: "feed_627",
    name: "New York",
    description: "A location-based feed featuring content from New York."
  },
  {
    id: "feed_628",
    name: "Coinbase Wallet Creators",
    description: "A feed highlighting content from Coinbase Wallet creators and community."
  },
  {
    id: "feed_629",
    name: "Warpcast Creators",
    description: "A feed featuring content from Warpcast creators and influencers."
  }
] as const

export type Feed = (typeof FEEDS)[number]

export type FeedId = Feed["id"]

export const ALL_FEED_IDS = FEEDS.map((feed) => feed.id)

export const DEFAULT_FEED_ID: FeedId = "feed_390"
