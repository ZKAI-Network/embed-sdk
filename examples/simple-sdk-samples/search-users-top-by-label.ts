import { getClient } from "@embed-ai/sdk"

const main = async () => {
  // Initialize the client with your API key
  const client = getClient(process.env.API_KEY_EMBED!)
  
  console.log("🔍 Finding top users by AI labels...")
  
  try {
    // Get top users for "science_technology" topic
    const techUsers = await client.search.users.getTopByLabel("science_technology", {
      top_k: 10,
      minimum_activity_count: 20,
      ratio_min: 0.8,
      conf_min: 0.7
    })
    
    console.log(`\n✅ Found ${techUsers.length} top users for "science_technology":`)
    techUsers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)} | Count: ${user.count} | Ratio: ${user.ratio.toFixed(2)}`)
    })
    
    // Get top users for "gaming" topic with default settings
    console.log("\n🔍 Finding top gaming users with default settings...")
    const gamingUsers = await client.search.users.getTopByLabel("gaming")
    
    console.log(`\n✅ Found ${gamingUsers.length} top users for "gaming":`)
    gamingUsers.slice(0, 5).forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)} | Count: ${user.count} | Ratio: ${user.ratio.toFixed(2)}`)
    })
    
    // Get top users for "web3_defi" label
    console.log("\n🔍 Finding top DeFi users...")
    const defiUsers = await client.search.users.getTopByLabel("web3_defi", {
      top_k: 15,
      minimum_activity_count: 15,
      ratio_min: 0.75
    })
    
    console.log(`\n✅ Found ${defiUsers.length} top users for "web3_defi":`)
    defiUsers.slice(0, 8).forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)} | Count: ${user.count} | Ratio: ${user.ratio.toFixed(2)}`)
    })
    
    // Get top users for "positive" sentiment
    console.log("\n🔍 Finding most positive users...")
    const positiveUsers = await client.search.users.getTopByLabel("positive", {
      top_k: 8,
      minimum_activity_count: 25,
      ratio_min: 0.85
    })
    
    console.log(`\n✅ Found ${positiveUsers.length} top users for "positive" sentiment:`)
    positiveUsers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)} | Count: ${user.count} | Ratio: ${user.ratio.toFixed(2)}`)
    })
    
    // Get top users for "arts_culture" with reversed order (lowest scores first)
    console.log("\n🔍 Finding users with lowest arts_culture scores...")
    const artsUsersReversed = await client.search.users.getTopByLabel("arts_culture", {
      top_k: 5,
      reverse: true,
      minimum_activity_count: 10
    })
    
    console.log(`\n✅ Found ${artsUsersReversed.length} lowest scoring users for "arts_culture":`)
    artsUsersReversed.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id} | Score: ${user.score.toFixed(4)} | Count: ${user.count} | Ratio: ${user.ratio.toFixed(2)}`)
    })
    
  } catch (error) {
    console.error("❌ Error getting top users by label:", error)
  }
}

main()
