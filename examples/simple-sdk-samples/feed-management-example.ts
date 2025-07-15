import { getClient } from "@embed-ai/sdk"

async function feedManagementExample() {
  // Initialize the client with your token
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    // 1. Create a new feed
    console.log("Creating a new feed...")
    const newFeed = await client.feed.createConfig({
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

    console.log("Created feed with ID:", newFeed.config_id)
    console.log("Initial feed configuration:", {
      name: newFeed.name,
      description: newFeed.description,
      ai_labels: newFeed.config.filters.ai_labels,
      start_timestamp: newFeed.config.filters.start_timestamp
    })

    // 2. List all feeds
    console.log("\nListing all feeds...")
    const feeds = await client.feed.listConfigs("private")
    console.log(`Found ${feeds.length} feeds:`)
    feeds.forEach((feed) => console.log(`- ${feed.name} (${feed.config_id})`))

    // 3. Get a specific feed
    console.log("\nRetrieving feed details for ID:", newFeed.config_id)
    const feedDetails = await client.feed.getConfig(newFeed.config_id)
    console.log("Current feed configuration:", {
      name: feedDetails.name,
      description: feedDetails.description,
      filters: feedDetails.config.filters
    })

    // 4. Update the feed
    console.log("\nUpdating feed with new configuration...")
    await client.feed.updateConfig(newFeed.config_id, {
      name: "Best Feed Ever",
      description: "This feed gets the most interesting content in web3",
      config: {
        filters: {
          ...feedDetails.config.filters,
          geo_locations: ["34.05,-118.24", "35.88,-106.30"],
          ai_labels: ["web3_nft", "web3_consumer", "web3_defi"],
          start_timestamp: "days_ago:30"
        }
      },
    })
    console.log("Feed updated successfully!")

    // 5. Get the updated feed to show the changes
    console.log("\nRetrieving updated feed details...")
    const updatedFeed = await client.feed.getConfig(newFeed.config_id)

    console.log("Feed successfully updated. Changes:", {
      name: {
        from: feedDetails.name,
        to: updatedFeed.name
      },
      description: {
        from: feedDetails.description,
        to: updatedFeed.description
      },
      geo_locations: {
        from: feedDetails.config.filters.geo_locations,
        to: updatedFeed.config.filters.geo_locations
      },
      ai_labels: {
        from: feedDetails.config.filters.ai_labels,
        to: updatedFeed.config.filters.ai_labels
      },
      start_timestamp: {
        from: feedDetails.config.filters.start_timestamp,
        to: updatedFeed.config.filters.start_timestamp
      }
    })
  } catch (error) {
    console.error("Error:", error)
  }
}

// Run the example
feedManagementExample()
