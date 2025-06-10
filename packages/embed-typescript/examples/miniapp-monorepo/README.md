# MiniApp Monorepo

This is a minimal monorepo example featuring:

- **Frontend:** React + Vite (in `packages/client`)
- **Backend:** Hono (in `packages/server`)
- **Shared:** tRPC for type-safe API communication (in `packages/shared`)
- **Package Manager:** Bun

## Prerequisites

- [Bun](https://bun.sh/)

## Setup

1.  Install dependencies:
    ```bash
    bun install
    ```

## Development

To run both the frontend and backend servers concurrently in development mode:

```bash
bun dev
```

- The Hono backend will be running on `http://localhost:3000`.
- The React frontend will be running on `http://localhost:5173`.

You can also run them separately:

- **Backend only:** `bun run dev:server`
- **Frontend only:** `bun run dev:client`
