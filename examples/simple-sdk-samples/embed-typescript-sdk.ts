import { getClient } from "@embed-ai/sdk"

const main = async () => {
  const client = getClient(process.env.API_KEY_EMBED!)
  // global trending: Feed ID: feed_388
  // Your "For you" Feed ID: feed_390
  const feed = await client.feed.byUserId("16085", "feed_390", { top_k: 10 })
  console.dir(feed, { depth: null })
}

main()
