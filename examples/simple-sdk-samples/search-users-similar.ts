import { getClient } from "@embed-ai/sdk"

const main = async () => {
  // Initialize the client with your API key
  const client = getClient(process.env.API_KEY_EMBED!)
  
  console.log("🔍 Finding similar users...")
  
  try {
    // Find similar users to user ID "16085" (dan.eth)
    const similarUsers = await client.search.users.similar("16085", {
      top_k: 10  // Get top 10 similar users
    })
    
    console.log(`\n✅ Found ${similarUsers.length} similar users:`)
    
    similarUsers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)}`)
    })
    
    // Example with default options (top_k: 25)
    console.log("\n🔍 Finding similar users with default options...")
    const defaultSimilar = await client.search.users.similar("16085")
    console.log(`Found ${defaultSimilar.length} similar users with default settings`)
    
    // Show top 3 results
    console.log("\nTop 3 most similar users:")
    defaultSimilar.slice(0, 3).forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)}`)
    })
    
  } catch (error) {
    console.error("❌ Error finding similar users:", error)
  }
}

main()
