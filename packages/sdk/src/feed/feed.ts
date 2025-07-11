import type { ForYou as ForYouParams, ForYouApiResponse, ForYouResponse } from "@embed-ai/types"
import type { IHttpClient } from "../interfaces/index.js"

export type FeedOptions = Omit<ForYouParams, "wallet_address" | "user_id" | "feed_id">

export async function byUserId(
  httpClient: IHttpClient,
  userId: string,
  feedId?: string,
  options?: FeedOptions
): Promise<ForYouResponse> {
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    user_id: userId,
    return_metadata: true,
    top_k,
    impression_count,
    feed_id: feedId,
    ...options
  }

  const response = await httpClient.post<ForYouApiResponse>("/v2/farcaster/casts/feed/for-you", params)
  return [...response.body]
}

export async function byWalletAddress(
  httpClient: IHttpClient,
  walletAddress: string,
  feedId?: string,
  options?: FeedOptions
): Promise<ForYouResponse> {
  const top_k = options?.top_k ?? 25
  const impression_count = options?.impression_count ?? top_k

  const params: ForYouParams = {
    wallet_address: walletAddress,
    return_metadata: true,
    top_k,
    impression_count,
    feed_id: feedId,
    ...options
  }

  const response = await httpClient.post<ForYouApiResponse>("/v2/farcaster/casts/feed/for-you", params)
  return [...response.body]
}
