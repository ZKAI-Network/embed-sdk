# Quick Start Deployment Guide

Get your miniapp-monorepo deployed in minutes with these simple commands.

## Option 1: Render.com (Easiest)

**Backend Service:**
1. **Create Web Service** for backend
2. **Configure**:
   ```
   Name: embed-miniapp-backend
   Root Directory: examples/miniapp-monorepo
   Build Command: bun install
   Start Command: bun packages/server/src/index.ts
   ```
3. **Set Environment Variables**:
   - `API_KEY_EMBED`: Your embed API key

**Frontend Service:**
1. **Create Static Site** for frontend
2. **Configure**:
   ```
   Name: embed-miniapp-frontend
   Root Directory: examples/miniapp-monorepo/packages/client
   Build Command: bun install && bun run build
   Publish Directory: dist
   ```
3. **Set Environment Variables**:
   - `VITE_API_URL`: https://embed-miniapp-backend.onrender.com

## Option 2: Fly.io (Dockerized Deployment)

**Prerequisites:**
```bash
# Install Fly CLI
brew install flyctl  # macOS
# curl -L https://fly.io/install.sh | sh  # other platforms
fly auth login
```

**Backend:**
```bash
# From monorepo root
# Optional: Edit fly.toml to set custom app name and region
fly launch --no-deploy
fly secrets set API_KEY_EMBED=your_api_key_here
fly deploy
```

**Frontend:**
```bash
# From packages/client
# Optional: Edit fly.toml to set custom app name and region
fly launch --no-deploy
# Build with backend URL
VITE_API_URL=https://your-backend-app.fly.dev bun run build
fly deploy
```

**Common Issues:**
- Frontend shows localhost errors: Rebuild with correct `VITE_API_URL`
- Backend returning 500 error: Check API_KEY_EMBED is set correctly (in the Secrets tab on the deployment on fly.io dashboard)
