import { getClient } from "../../packages/sdk/dist/src/index.js"

async function datasourceExample() {
  // Initialize the client with your token
  const client = getClient(process.env.API_KEY_EMBED!)

  try {
    // 1. Create a new datasource
    console.log("Creating a new datasource...")
    const datasource = await client.datasource.create({
      name: "my-web3-app"
    })

    console.log("Created datasource:", {
      id: datasource.datasource_id,
      customer_id: datasource.customer_id,
      status: datasource.status,
      name: datasource.name
    })

    // 2. Ingest sample user data
    console.log("\nIngesting user data...")
    const sampleUsers = [
      {
        user_id: "farcaster.alice123",
        protocol: "farcaster" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        username: "alice",
        display_name: "Alice Cooper",
        bio: "Web3 developer and content creator",
        follower_count: 1250,
        following_count: 890,
        verified: true,
        tags: ["developer", "web3", "creator"]
      },
      {
        user_id: "lens.creator456",
        protocol: "lens" as const,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        username: "creator456",
        display_name: "Content Creator",
        bio: "Creating amazing content on Lens",
        follower_count: 850,
        following_count: 400,
        verified: false
      }
    ]

    const userIngestionResult = await client.datasource.ingestUsers(
      datasource.datasource_id,
      sampleUsers
    )

    console.log("User ingestion result:", {
      message: userIngestionResult.message,
      stream_name: userIngestionResult.stream_name,
      total_records: userIngestionResult.total_records,
      successful_records: userIngestionResult.successful_records
    })

    // 3. Ingest sample content items
    console.log("\nIngesting content items...")
    const sampleItems = [
      {
        item_id: "farcaster.0xabc123",
        protocol: "farcaster" as const,
        author_id: "farcaster.alice123",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        publication_type: "frame" as const,
        root_item_id: "farcaster.0xabc123",
        language_score: 0.95,
        title: "My Interactive Farcaster Frame",
        content: "Check out this cool interactive frame!",
        tags: ["web3", "farcaster", "frame"],
        language: "en" as const,
        like_count: 42,
        comment_count: 5,
        share_count: 12
      },
      {
        item_id: "lens.post456",
        protocol: "lens" as const,
        author_id: "lens.creator456",
        created_at: "2024-01-15T11:00:00Z",
        updated_at: "2024-01-15T11:00:00Z",
        publication_type: "image" as const,
        root_item_id: "lens.post456",
        language_score: 0.98,
        title: "Beautiful Sunset",
        content: "Captured this amazing sunset today!",
        tags: ["photography", "nature", "sunset"],
        language: "en" as const,
        like_count: 128,
        comment_count: 23,
        view_count: 1500,
        image_urls: ["https://example.com/sunset.jpg"]
      }
    ]

    const itemIngestionResult = await client.datasource.ingestItems(
      datasource.datasource_id,
      sampleItems
    )

    console.log("Item ingestion result:", {
      message: itemIngestionResult.message,
      stream_name: itemIngestionResult.stream_name,
      total_records: itemIngestionResult.total_records,
      successful_records: itemIngestionResult.successful_records
    })

    // 4. Track user interactions with content
    console.log("\nTracking user interactions...")
    const sampleInteractions = [
      {
        item_id: "farcaster.0xabc123",
        timestamp: 1705312200,
        event_type: "like" as const,
        user_id: "farcaster.alice123"
      },
      {
        item_id: "lens.post456",
        timestamp: 1705312800,
        event_type: "view" as const,
        user_id: "lens.creator456"
      },
      {
        item_id: "farcaster.0xabc123",
        timestamp: 1705313000,
        event_type: "share" as const,
        session_id: "sess_anonymous_xyz789" // Anonymous user interaction
      }
    ]

    const interactionResult = await client.datasource.trackItemInteractions(
      datasource.datasource_id,
      sampleInteractions
    )

    console.log("Interaction tracking result:", {
      message: interactionResult.message,
      stream_name: interactionResult.stream_name,
      total_records: interactionResult.total_records,
      successful_records: interactionResult.successful_records
    })

    // 5. Track user interactions (different stream)
    console.log("\nTracking user-specific interactions...")
    const userInteraction = {
      item_id: "lens.post456",
      timestamp: 1705314000,
      event_type: "bookmark" as const,
      user_id: "farcaster.alice123"
    }

    const userInteractionResult = await client.datasource.trackUserInteractions(
      datasource.datasource_id,
      userInteraction
    )

    console.log("User interaction tracking result:", {
      message: userInteractionResult.message,
      stream_name: userInteractionResult.stream_name
    })

    // 6. Demonstrate single item ingestion
    console.log("\nIngesting a single new item...")
    const singleItem = {
      item_id: "mirror.article789",
      protocol: "mirror" as const,
      author_id: "lens.creator456", // Cross-protocol authorship
      created_at: "2024-01-15T12:00:00Z",
      updated_at: "2024-01-15T12:00:00Z",
      publication_type: "article" as const,
      root_item_id: "mirror.article789",
      language_score: 0.99,
      title: "Web3 Development Best Practices",
      content: "A comprehensive guide to building web3 applications...",
      excerpt: "Learn the essential patterns for web3 development",
      tags: ["web3", "development", "guide", "best-practices"],
      language: "en" as const,
      word_count: 2500,
      read_time_minutes: 10,
      is_published: true,
      is_featured: true
    }

    const singleItemResult = await client.datasource.ingestItems(
      datasource.datasource_id,
      singleItem
    )

    console.log("Single item ingestion result:", {
      message: singleItemResult.message,
      stream_name: singleItemResult.stream_name,
      sequence_number: singleItemResult.sequence_number
    })

    console.log("\n✅ Datasource example completed successfully!")
    console.log(`📊 Summary:`)
    console.log(`   - Created datasource: ${datasource.datasource_id}`)
    console.log(`   - Ingested ${sampleUsers.length} users`)
    console.log(`   - Ingested ${sampleItems.length + 1} items`)
    console.log(`   - Tracked ${sampleInteractions.length + 1} interactions`)

  } catch (error) {
    console.error("❌ Error in datasource example:", error)
    
    // Type-safe error handling
    if (error && typeof error === 'object' && 'status' in error) {
      console.error(`HTTP Error ${error.status}:`, error)
      
      // Helpful message for 404 errors (API not yet available)
      if (error.status === 404) {
        console.log("\n💡 Note: The datasource API endpoints may not be available yet.")
        console.log("   This example demonstrates the SDK integration and will work once the API is deployed.")
      }
    }
  }
}

// Run the example
datasourceExample()