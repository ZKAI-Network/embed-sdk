import { getClient } from "../src/client.js"

async function feedManagementExample() {
  // Initialize the client with your token
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    // 1. Create a new feed
    console.log("Creating a new feed...")
    const newFeed = await client.createFeed({
      name: "Experimental Feed",
      description: "Experimenting with a for-you feed",
      endpoint: "casts/feed/for-you",
      status: "active",
      visibility: "private",
      config: {
        filters: {
          channels: [],
          app_fids: [],
          geo_locations: [],
          remove_geo_locations: [],
          ai_labels: ["web3_nft", "web3_consumer"],
          publication_types: [],
          remove_ai_labels: [],
          author_ids: [],
          remove_author_ids: [],
          embed_domains: [],
          start_timestamp: "days_ago:7"
        },
        return_global_fallback: true,
        scoring: "all"
      },
      feed_image_url: "https://d138qfh819yqwb.cloudfront.net/images/console/feed-defaults/28.jpg"
    })

    console.log("Created feed:", newFeed.config_id)

    // 2. List all feeds
    console.log("\nListing all feeds...")
    const feeds = await client.listFeeds("private")
    console.log(`Found ${feeds.length} feeds`)

    // 3. Get a specific feed
    console.log("\nRetrieving feed details...")
    const feedDetails = await client.getFeed(newFeed.config_id)

    // 4. Update the feed
    console.log("\nUpdating feed...")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedFeed = await client.updateFeed({
      config_id: newFeed.config_id,
      name: "Best Feed Ever",
      description: "This feed gets the most interesting content in web3",
      config: {
        filters: {
          ...feedDetails.config.filters,
          geo_locations: ["34.05,-118.24", "35.88,-106.30"],
          ai_labels: ["web3_nft", "web3_consumer", "web3_defi"],
          start_timestamp: "days_ago:30"
        }
      }
    })

    console.log("Updated feed")
  } catch (error) {
    console.error("Error:", error)
  }
}

// Run the example
feedManagementExample()
