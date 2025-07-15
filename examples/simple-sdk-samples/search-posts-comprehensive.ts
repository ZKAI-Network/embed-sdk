import { getClient } from "@embed-ai/sdk"

async function main() {
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    console.log("🔍 Comprehensive Posts Search Demo")
    console.log("===================================\n")

    // Example 1: Search posts by query with basic options
    console.log("1️⃣ Basic semantic search for posts")
         try {
       const basicSearch = await client.search.posts.byQuery("web3 blockchain development")
       console.log(`✅ Found ${basicSearch.length} posts`)
       
       basicSearch.slice(0, 3).forEach((post, index) => {
         console.log(`  ${index + 1}. ${post.item_id} (score: ${post.score.toFixed(3)})`)
       })
     } catch (error) {
       console.log(`❌ Basic search failed: ${error}`)
     }

    console.log("\n2️⃣ Advanced semantic search with filters")
    try {
      const advancedSearch = await client.search.posts.byQuery("artificial intelligence", {
        top_k: 5,
        return_ai_labels: true,
        return_metadata: true,
        filters: {
          start_timestamp: String(Math.floor(Date.now() / 1000) - 86400 * 30), // Last 30 days
          ai_labels: ["science_technology"],
          frames_only: false
        }
      })
             console.log(`✅ Found ${advancedSearch.length} AI posts from last 30 days`)
       
       advancedSearch.forEach((post, index) => {
         console.log(`  ${index + 1}. ${post.item_id} (score: ${post.score.toFixed(3)})`)
       })
    } catch (error) {
      console.log(`❌ Advanced search failed: ${error}`)
    }

    console.log("\n3️⃣ Get moderation labels for specific posts")
    try {
      const testCastIds = [
        "0x4888649440c8cfd3ef6e28f2096a201d20253176",
        "0x0ecf95b73aa54d583877821ece241e94de701404"
      ]
      
      const moderationLabels = await client.search.posts.getLabels(testCastIds, "moderation")
      console.log(`✅ Retrieved labels for ${moderationLabels.length} posts`)
      
      moderationLabels.forEach((postLabels, index) => {
        console.log(`  Post ${index + 1}:`)
        postLabels.moderation.slice(0, 3).forEach(label => {
          console.log(`    ${label.label}: ${(label.score * 100).toFixed(1)}%`)
        })
      })
    } catch (error) {
      console.log(`❌ Moderation labels failed: ${error}`)
    }

    console.log("\n4️⃣ Get all labels for posts")
    try {
      const testCastIds = [
        "0x4888649440c8cfd3ef6e28f2096a201d20253176"
      ]
      
      const allLabels = await client.search.posts.getLabels(testCastIds, "all")
      console.log(`✅ Retrieved all labels for ${allLabels.length} post(s)`)
      
      allLabels.forEach((postLabels, index) => {
        console.log(`  Post ${index + 1} - All categories:`)
        postLabels.moderation.slice(0, 2).forEach(label => {
          console.log(`    ${label.label}: ${(label.score * 100).toFixed(1)}%`)
        })
      })
    } catch (error) {
      console.log(`❌ All labels failed: ${error}`)
    }

    console.log("\n✅ Comprehensive demo completed!")
    console.log("\n📋 Available methods:")
    console.log("  • client.search.posts.byQuery(query, options)")
    console.log("  • client.search.posts.getLabels(castIds, labelCategory, options)")

  } catch (error) {
    console.error("❌ Demo failed:", error)
  }
}

main().catch(console.error) 
