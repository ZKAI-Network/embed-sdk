import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@embed-ai/sdk";

// Initialize client only when needed to avoid build-time errors
let client: ReturnType<typeof getClient> | null = null;

function getEmbedClient() {
  if (!client) {
    if (!process.env.API_KEY_EMBED) {
      throw new Error("API_KEY_EMBED environment variable is not set");
    }
    client = getClient(process.env.API_KEY_EMBED);
  }
  return client;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");
    const feedId = searchParams.get("feed_id");

    if (!fid) {
      return NextResponse.json(
        { error: "fid parameter is required" },
        { status: 400 }
      );
    }

    if (!process.env.API_KEY_EMBED) {
      return NextResponse.json(
        { error: "API_KEY_EMBED environment variable is not set" },
        { status: 500 }
      );
    }

    const fidNumber = parseInt(fid, 10);
    if (isNaN(fidNumber)) {
      return NextResponse.json(
        { error: "fid must be a valid number" },
        { status: 400 }
      );
    }

    // Call the Embed AI SDK for feed data
    const embedClient = getEmbedClient();
    const feedData = await embedClient.feed.byUserId(fid, feedId || undefined, {
      top_k: 10,
    });

    return NextResponse.json(feedData);
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed data" },
      { status: 500 }
    );
  }
}
