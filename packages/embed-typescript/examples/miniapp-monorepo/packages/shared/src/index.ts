import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createMbdClient } from "embed-typescript/src/client.js";

const t = initTRPC.context<{ MBD_API_KEY?: string }>().create();

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

      if (!ctx.MBD_API_KEY) {
        throw new Error("MBD_API_KEY is not configured on the server.");
      }

      try {
        console.log("Creating MBD client...");
        const client = createMbdClient(ctx.MBD_API_KEY);
        console.log("Fetching ForYouReranked feed for fid:", input.fid);
        const feed = await client.api.ForYouReranked({
          user_id: String(input.fid),
          items_list: [],
        });
        console.log("Successfully fetched feed:", feed);
        return feed;
      } catch (error) {
        console.error("Error fetching ForYou feed:", error);
        throw new Error("Failed to fetch ForYou feed.");
      }
    }),
});

export type AppRouter = typeof appRouter;
