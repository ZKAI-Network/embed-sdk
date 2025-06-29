// This file is used to share the tRPC router type definition with the client.
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getClient } from "embed-typescript";

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
});

export type AppRouter = typeof appRouter; 
