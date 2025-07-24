export const FEEDS = [
  {
    id: "feed_274",
    name: "Music Related",
    description: "A feed of music related content that is personalized to the user."
  },
  {
    id: "feed_276",
    name: "Science and Technology",
    description: "A feed of high quality content related to tech & science."
  },
  {
    id: "feed_332",
    name: "Canadian Life",
    description: "Feed filtering posts from people living in Canada!"
  },
  {
    id: "feed_335",
    name: "Hello from Super",
    description: "Filtering content posted from Super, a Farcaster client hosted at Super.sc."
  },
  {
    id: "feed_388",
    name: "Trending",
    description: "A feed of content that is quickly gaining traction across the FC social graph."
  },
  {
    id: "feed_390",
    name: "For You",
    description: "This is a for you feed that works particularly well with users who have an FID."
  }
] as const

export type Feed = (typeof FEEDS)[number]

export type FeedId = Feed["id"]

export const ALL_FEED_IDS = FEEDS.map((feed) => feed.id)

export const DEFAULT_FEED_ID: FeedId = "feed_390"