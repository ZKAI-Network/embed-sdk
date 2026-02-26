export type OgDataSuccess = Extract<OgData, { success: true }>

export type OgData = {
  success: true
  is_image?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImage?: Array<{ url: string }>
  ogUrl?: string
  requestUrl?: string
  [key: string]: any
} | {
  success: false
  error?: any
}

export type OgDataState = {
  data?: OgData
  isLoading: boolean
  error?: unknown
}

export interface Author {
  display_name: string
  fid: number
  pfp_url: string
  username: string
}

export interface FeedItemMetadata {
  author: Author
  comments_count?: number
  embed_items?: Array<string>
  likes_count?: number
  shares_count?: number
  text: string
  timestamp: number
}

export interface FeedItem {
  source: "farcaster"
  item_id: string
  metadata: FeedItemMetadata
}

export interface PolymarketFeedItem {
  source: "polymarket"
  item_id: string
  metadata: PolymarketFeedItemMetadata
}

export interface PolymarketUserStory {
  outcome?: string
  usdc?: number
  price?: number
  user_pnl?: number
  user_name?: string
  user_pseudonym?: string
  user_pfp?: string
  timestamp?: string
}

export interface PolymarketFeedItemMetadata {
  question?: string
  image?: string
  icon?: string
  active?: boolean
  closed?: boolean
  volume_24hr?: number
  one_day_price_change?: number
  spread?: number
  last_trade_price?: number
  user_stories?: Array<PolymarketUserStory>
}
