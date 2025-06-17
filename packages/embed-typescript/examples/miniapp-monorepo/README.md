# MiniApp Monorepo

This is a minimal monorepo example featuring:

- **Frontend:** React + Vite (in `packages/client`)
- **Backend:** Hono (in `packages/server`)
- **Shared:** tRPC for type-safe API communication (in `packages/shared`)
- **Package Manager:** Bun

## Prerequisites

- [Bun](https://bun.sh/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (for Farcaster frame testing)

## Setup

1. Install dependencies:
    ```bash
    bun install
    ```

2. Configure environment variables:

### Server Environment Variables

Create `packages/server/.env`:
```bash
API_KEY_EMBED=your_embed_api_key_here
```

### Client Environment Variables

Create `packages/client/.env`:
```bash
VITE_API_URL=http://127.0.0.1:3000
```

> **Note:** For Farcaster frame testing, you'll need to use a public URL (see Testing section below).

## Development

### Local Development

To run both the frontend and backend servers concurrently in development mode:

```bash
bun dev
```

- The Hono backend will be running on `http://localhost:3000`.
- The React frontend will be running on `http://localhost:5173`.

You can also run them separately:

- **Backend only:** `bun run dev:server`
- **Frontend only:** `bun run dev:client`

### Testing with Farcaster Miniapp

To test your miniapp as a Farcaster miniapp, you need to make your local development server accessible via a public URL using Cloudflare tunnels:

1. **Start your development servers:**
   ```bash
   bun run dev:server    # Backend on localhost:3000
   bun run dev:client    # Frontend on localhost:5173
   ```

2. **Create a tunnel for your backend:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   This will give you a public URL like: `https://word-word-word-word.trycloudflare.com`

3. **Update your client environment variables:**
   Update `packages/client/.env`:
   ```bash
   VITE_API_URL=https://word-word-word-word.trycloudflare.com
   ```
   Replace with your actual tunnel URL from step 2.

4. (Optional) **Restart your frontend:**
   ```bash
   bun run dev:client
   ```
   Optional as it will normally restart automatically.
5. **Create a tunnel for your frontend:**
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
   This will give you another public URL like: `https://another-word-sequence.trycloudflare.com`

6. **Test in Farcaster:**
   - Go to [https://farcaster.xyz/~/developers](https://farcaster.xyz/~/developers) or open the developer section in your Farcaster app
   - Use the frontend tunnel URL (from step 5) to test your miniapp
   - The app will now have access to the Farcaster miniapp context and user data

## Project Structure

```
packages/
├── client/          # React frontend with Vite
│   ├── src/
│   └── .env         # VITE_API_URL
├── server/          # Hono backend
│   ├── src/
│   └── .env         # API_KEY_EMBED
└── shared/          # Shared tRPC router and types
    └── src/
```

## Features

- **Personalized Feed:** Shows personalized "For You" content when running in a Farcaster frame
- **Demo Mode:** Falls back to demo content (FID 3) when not in a frame
- **Real-time Updates:** Uses tRPC for type-safe real-time communication
- **Responsive UI:** Built with Mantine UI components for a modern look
