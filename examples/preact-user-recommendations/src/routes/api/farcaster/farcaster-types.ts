export interface FarcasterUser {
  object: "user"
  fid: number
  username: string
  display_name: string
  custody_address: string
  pro: {
    status: string
    subscribed_at: string
    expires_at: string
  }
  pfp_url: string
  profile: {
    bio: {
      text: string
      mentioned_profiles: Array<{
        object: "user_dehydrated"
        fid: number
        username: string
        display_name: string
        pfp_url: string
        custody_address: string
      }>
      mentioned_profiles_ranges: Array<{
        start: number
        end: number
      }>
      mentioned_channels: Array<{
        id: string
        name: string
        object: "channel_dehydrated"
        image_url: string
        viewer_context: {
          following: boolean
          role: string
        }
      }>
      mentioned_channels_ranges: Array<{
        start: number
        end: number
      }>
    }
    location: {
      latitude: number
      longitude: number
      address: {
        city: string
        state: string
        state_code: string
        country: string
        country_code: string
      }
      radius: number
    }
    banner: {
      url: string
    }
  }
  follower_count: number
  following_count: number
  verifications: Array<string>
  verified_addresses: {
    eth_addresses: Array<string>
    sol_addresses: Array<string>
    primary: {
      eth_address: string
      sol_address: string
    }
  }
  verified_accounts: Array<{
    platform: string
    username: string
  }>
  power_badge: boolean
  experimental: {
    deprecation_notice: string
    neynar_user_score: number
  }
  viewer_context: {
    following: boolean
    followed_by: boolean
    blocking: boolean
    blocked_by: boolean
  }
  score: number
}

export interface FarcasterApiResponse {
  users: Array<FarcasterUser>
}
