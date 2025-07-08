import type { IHttpClient } from "../interfaces/index.js"
import type { ForYouResponse } from "../types-return/ForYou.js"
import type { ForYou as ForYouParams } from "../types/ForYou.js"

export type FeedOptions = Omit<ForYouParams, "wallet_address" | "user_id">

/**
 * Get personalized "For You" feed by user ID
 */
export async function getFeedByUserId(
  httpClient: IHttpClient,
  userId: string,
  options?: FeedOptions
): Promise<ForYouResponse> {
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    user_id: userId,
    return_metadata: true,
    top_k,
    impression_count,
    ...options
  }

  return httpClient.post("/v2/farcaster/casts/feed/for-you", params)
}

/**
 * Get personalized "For You" feed by wallet address
 */
export async function getFeedByWalletAddress(
  httpClient: IHttpClient,
  walletAddress: string,
  options?: FeedOptions
): Promise<ForYouResponse> {
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    wallet_address: walletAddress,
    return_metadata: true,
    top_k,
    impression_count,
    ...options
  }

  return httpClient.post("/v2/farcaster/casts/feed/for-you", params)
}
