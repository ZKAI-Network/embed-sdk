import { getClient } from "../src/index.js"

const main = async () => {
  const client = getClient(process.env.API_KEY_EMBED!)
  const feed = await client.getFeedByUserId("16085", { top_k: 10 })
  console.dir(feed, { depth: null })
}

main()
