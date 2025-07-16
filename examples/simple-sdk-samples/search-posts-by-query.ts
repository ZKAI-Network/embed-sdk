import { getClient } from "@embed-ai/sdk"

async function main() {
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    console.log("🔍 Searching posts by semantic query...")

    // Search for posts about web3 and blockchain
    const query = "web3 blockchain cryptocurrency developments"
    
    const searchResults = await client.search.posts.byQuery(query, {
      top_k: 5,
      return_ai_labels: true,
      return_metadata: true
    })

    console.log("📊 Search Results:")
    console.log(`Query: "${query}"`)
    console.log(`Found ${searchResults.length} matching posts`)

    searchResults.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`)
      console.log(`Cast ID: ${post.item_id}`)
      console.log(`Relevance Score: ${(post.score * 100).toFixed(2)}%`)
    })

    // Search for posts about AI and machine learning
    console.log("\n🔍 Searching for AI/ML posts...")
    
    const aiQuery = "artificial intelligence machine learning AI development"
    const aiResults = await client.search.posts.byQuery(aiQuery, {
      top_k: 3,
      filters: {
        start_timestamp: String(Math.floor(Date.now() / 1000) - 86400 * 7), // Last 7 days
      }
    })

    console.log("\n📊 AI/ML Search Results:")
    console.log(`Query: "${aiQuery}"`)
    console.log(`Found ${aiResults.length} matching posts from last 7 days`)

    aiResults.forEach((post, index) => {
      console.log(`\n--- AI Post ${index + 1} ---`)
      console.log(`Cast ID: ${post.item_id}`)
      console.log(`Relevance Score: ${(post.score * 100).toFixed(2)}%`)
    })

  } catch (error) {
    console.error("❌ Error searching posts:", error)
  }
}

main().catch(console.error) 
