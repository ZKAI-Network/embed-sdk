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
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    user_id: userId,
    return_metadata: true,
    ...options,
    top_k,
    impression_count,
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
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    wallet_address: walletAddress,
    return_metadata: true,
    ...options,
    top_k,
    impression_count,
  }

  return httpClient.post("/v2/farcaster/casts/feed/for-you", params)
}
