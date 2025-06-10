import { trpcServer } from "@hono/trpc-server"
import { appRouter } from "@shared/trpc"
import { type Context, Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()

app.use(
  "/trpc/*",
  cors({
    origin: "http://localhost:5173" // vite dev server
  })
)

app.get("/", (c: Context) => {
  return c.text("Hello Hono!")
})

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter
  })
)

console.log("Hono server running on http://localhost:3000")

export default {
  port: 3000,
  fetch: app.fetch
}
