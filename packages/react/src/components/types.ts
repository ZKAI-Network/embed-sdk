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
}

export interface FeedItem {
  item_id: string
  metadata: FeedItemMetadata
}
