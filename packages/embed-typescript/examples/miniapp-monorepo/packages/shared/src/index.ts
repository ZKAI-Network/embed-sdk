// This file is used to share the tRPC router type definition with the client.
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getClient } from "embed-typescript/src/index.js";
import ogs from "open-graph-scraper";

const t = initTRPC.context<{ API_KEY_EMBED?: string }>().create();

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }).nullish())
    .query(({ input }) => {
      return `Hello, ${input?.name ?? "World"}! from tRPC`;
    }),
  forYouFeed: t.procedure
    .input(z.object({ fid: z.number() }))
    .query(async ({ input, ctx }) => {
      console.log("Executing forYouFeed procedure with input:", input);

      if (!ctx.API_KEY_EMBED) {
        throw new Error("API_KEY_EMBED is not configured on the server.");
      }

      try {
        console.log("Creating Embed client...");
        const client = getClient(ctx.API_KEY_EMBED);
        console.log("Fetching For You feed for fid:", input.fid);
        const feed = await client.getForYouFeedByUserId(String(input.fid), { top_k: 10 });
        console.log("Successfully fetched feed:", feed);
        return feed;
      } catch (error) {
        console.error("Error fetching ForYou feed:", error);
        throw new Error("Failed to fetch ForYou feed.");
      }
    }),
  getOgData: t.procedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      try {
        // This is really a basic way of retrieving og data, not production level and not reliable
        const options = {
          url: input.url,
          fetchOptions: {
            headers: {
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            },
          },
        };
        const { result } = await ogs(options);
        return result;
      } catch (error: any) {
        // In a production app, you'd want to handle these errors more granularly
        // or use a more robust OG data fetching solution. For this sample app,
        // we'll just suppress the errors and let the frontend handle the fallback.
        return { success: false, error };
      }
    }),
});

export type AppRouter = typeof appRouter; 
