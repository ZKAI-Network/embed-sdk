import type { IHttpClient } from "../interfaces/index.js"
import type { ForYouResponse } from "../types-return/ForYou.js"
import type { ForYou as ForYouParams } from "../types/ForYou.js"


export type ForYouOptions = Omit<ForYouParams, "wallet_address" | "user_id">

/**
 * Get personalized "For You" feed by user ID
 */
export async function getForYouFeedByUserId(
  httpClient: IHttpClient,
  userId: string,
  options?: ForYouOptions
): Promise<ForYouResponse> {
  const params: ForYouParams = {
    user_id: userId,
    top_k: 25,
    return_metadata: true,
    ...options
  }

  return httpClient.post("/v2/farcaster/casts/feed/for-you", params)
}

/**
 * Get personalized "For You" feed by wallet address
 */
export async function getForYouFeedByWalletAddress(
  httpClient: IHttpClient,
  walletAddress: string,
  options?: ForYouOptions
): Promise<ForYouResponse> {
  const params: ForYouParams = {
    wallet_address: walletAddress,
    top_k: 25,
    return_metadata: true,
    ...options
  }

  return httpClient.post("/v2/farcaster/casts/feed/for-you", params)
}
