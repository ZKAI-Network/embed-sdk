import { getClient } from "@embed-ai/sdk"

const main = async () => {
  // Initialize the client with your API key
  const client = getClient(process.env.API_KEY_EMBED!)
  
  console.log("🔍 Getting AI labels for users...")
  
  try {
    // Get all labels for a list of users
    const userList = ["16085", "239", "3", "5650", "1689"]
    const allLabels = await client.search.users.getLabels(userList, "all")
    
    console.log(`\n✅ Found labels for ${allLabels.length} users (all categories):`)
    allLabels.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.user_id}`)
      
      // Show top 3 topic labels
      if (user.ai_labels.topics.length > 0) {
        console.log("  📚 Topics:")
        user.ai_labels.topics.slice(0, 3).forEach(label => {
          console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
        })
      }
      
      // Show sentiment labels
      if (user.ai_labels.sentiment.length > 0) {
        console.log("  😊 Sentiment:")
        user.ai_labels.sentiment.slice(0, 2).forEach(label => {
          console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
        })
      }
      
      // Show top 2 emotion labels
      if (user.ai_labels.emotion.length > 0) {
        console.log("  💭 Emotions:")
        user.ai_labels.emotion.slice(0, 2).forEach(label => {
          console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
        })
      }
      
      // Show moderation labels if any
      if (user.ai_labels.moderation.length > 0) {
        console.log("  🛡️ Moderation:")
        user.ai_labels.moderation.slice(0, 2).forEach(label => {
          console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
        })
      }
    })
    
    // Get only topic labels for specific users
    console.log("\n🔍 Getting topic labels only...")
    const topicLabels = await client.search.users.getLabels(["16085", "239"], "topics")
    
    console.log(`\n✅ Found topic labels for ${topicLabels.length} users:`)
    topicLabels.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.user_id}`)
      console.log("  📚 Topics:")
      user.ai_labels.topics.slice(0, 5).forEach(label => {
        console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
      })
    })
    
    // Get sentiment labels for users
    console.log("\n🔍 Getting sentiment labels...")
    const sentimentLabels = await client.search.users.getLabels(["16085", "3", "5650"], "sentiment")
    
    console.log(`\n✅ Found sentiment labels for ${sentimentLabels.length} users:`)
    sentimentLabels.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.user_id}`)
      console.log("  😊 Sentiment:")
      user.ai_labels.sentiment.forEach(label => {
        console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
      })
    })
    
    // Get emotion labels for users
    console.log("\n🔍 Getting emotion labels...")
    const emotionLabels = await client.search.users.getLabels(["16085", "239"], "emotion")
    
    console.log(`\n✅ Found emotion labels for ${emotionLabels.length} users:`)
    emotionLabels.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.user_id}`)
      console.log("  💭 Emotions:")
      user.ai_labels.emotion.slice(0, 5).forEach(label => {
        console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
      })
    })
    
    // Get moderation labels for users
    console.log("\n🔍 Getting moderation labels...")
    const moderationLabels = await client.search.users.getLabels(["16085", "3"], "moderation")
    
    console.log(`\n✅ Found moderation labels for ${moderationLabels.length} users:`)
    moderationLabels.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.user_id}`)
      console.log("  🛡️ Moderation:")
      user.ai_labels.moderation.forEach(label => {
        console.log(`    - ${label.label}: ${label.score.toFixed(4)}`)
      })
    })
    
  } catch (error) {
    console.error("❌ Error getting user labels:", error)
  }
}

main()
