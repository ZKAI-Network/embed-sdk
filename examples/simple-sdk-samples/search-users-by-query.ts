import { getClient } from "@embed-ai/sdk"

const main = async () => {
  // Initialize the client with your API key
  const client = getClient(process.env.API_KEY_EMBED!)
  
  console.log("🔍 Searching users by semantic query...")
  
  try {
    // Search for users related to "web3 developers"
    const web3Developers = await client.search.users.byQuery("web3 developers", {
      top_k: 10
    })
    
    console.log(`\n✅ Found ${web3Developers.length} users for "web3 developers":`)
    web3Developers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)}`)
    })
    
    // Search for users interested in AI/ML
    console.log("\n🔍 Searching for AI/ML enthusiasts...")
    const aiEnthusiasts = await client.search.users.byQuery("artificial intelligence machine learning", {
      top_k: 8
    })
    
    console.log(`\n✅ Found ${aiEnthusiasts.length} users for "artificial intelligence machine learning":`)
    aiEnthusiasts.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)}`)
    })
    
    // Search for gaming enthusiasts
    console.log("\n🔍 Searching for gaming enthusiasts...")
    const gamers = await client.search.users.byQuery("gaming video games esports", {
      top_k: 5
    })
    
    console.log(`\n✅ Found ${gamers.length} users for "gaming video games esports":`)
    gamers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)}`)
    })
    
    // Example with default options (top_k: 25)
    console.log("\n🔍 Searching with default options...")
    const defaultSearch = await client.search.users.byQuery("crypto defi blockchain")
    console.log(`Found ${defaultSearch.length} users for "crypto defi blockchain" with default settings`)
    
  } catch (error) {
    console.error("❌ Error searching users:", error)
  }
}

main()
