// AppRouter type definition for client-side tRPC usage
// This should match the server's AppRouter type exactly

import { initTRPC } from "@trpc/server"
import { z } from "zod"
import { ALL_FEED_IDS } from "../constants/feedIds"

const t = initTRPC.context<{ API_KEY_EMBED?: string }>().create()

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }).nullish())
    .query(({ input }) => {
      return `Hello, ${input?.name ?? "World"}! from tRPC`
    }),
  forYouFeed: t.procedure
    .input(
      z.object({
        fid: z.number(),
        feed_id: z.enum(ALL_FEED_IDS as [string, ...Array<string>]).optional()
      })
    )
    .query(async () => {
      // This is just for type inference, implementation is on server
    }),
  getOgData: t.procedure
    .input(z.object({ url: z.string().url() }))
    .query(async () => {
      // This is just for type inference, implementation is on server
    })
})

export type AppRouter = typeof appRouter
