import { trpcServer } from "@hono/trpc-server"
import { appRouter } from "@shared/trpc"
import { type Context, Hono } from "hono"
import { serveStatic } from "hono/bun"
import { cors } from "hono/cors"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: "*", // Allow any origin for now
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  })
)

// Serve static files from the built client
app.use("/*", serveStatic({ root: "../client/dist" }))

app.get("/health", (c: Context) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.API_KEY_EMBED
  })
})

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: () => {
      return {
        API_KEY_EMBED: process.env.API_KEY_EMBED
      }
    },
    onError: ({ error, path }) => {
      console.error(`tRPC Error on path: ${path}`, error)
    }
  })
)

// Fallback for SPA routing - serve index.html for any unmatched routes
app.get("*", (c: Context) => {
  return c.html("../client/dist/index.html")
})

console.log("Hono server running on http://localhost:3000")

export default {
  port: 3000,
  fetch: app.fetch
}
