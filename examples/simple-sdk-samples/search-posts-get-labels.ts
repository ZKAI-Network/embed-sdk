import { getClient } from "@embed-ai/sdk"

async function main() {
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    console.log("🔍 Getting AI labels for posts...")

    // Example cast IDs - these should be valid cast hashes
    const castIds = [
      "0x4888649440c8cfd3ef6e28f2096a201d20253176",
      "0x0ecf95b73aa54d583877821ece241e94de701404"
    ]

    // Get moderation labels for the casts
    const postLabels = await client.search.posts.getLabels(castIds, "moderation")

    console.log("📊 Post Labels Results:")
    console.log(`Found labels for ${postLabels.length} posts`)

    postLabels.forEach((postLabel, index) => {
      console.log(`\n--- Post ${index + 1} ---`)
      console.log("Moderation Labels:")
      
      postLabel.moderation.forEach(label => {
        console.log(`  ${label.label}: ${(label.score * 100).toFixed(2)}%`)
      })
    })

    // Get all labels for the casts
    console.log("\n🔍 Getting ALL labels for posts...")
    const allLabels = await client.search.posts.getLabels(castIds, "all")

    console.log("\n📊 All Labels Results:")
    allLabels.forEach((postLabel, index) => {
      console.log(`\n--- Post ${index + 1} (All Labels) ---`)
      console.log("Moderation Labels:")
      
      postLabel.moderation.forEach(label => {
        console.log(`  ${label.label}: ${(label.score * 100).toFixed(2)}%`)
      })
    })

  } catch (error) {
    console.error("❌ Error getting post labels:", error)
  }
}

main().catch(console.error) 
