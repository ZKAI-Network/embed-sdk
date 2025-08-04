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

```bash
# Install Fly CLI
brew install flyctl

# Clone and setup
git clone <repo>
cd examples/miniapp-monorepo

# Environment Setup
# Backend environment
cp packages/server/.env.example packages/server/.env
nano packages/server/.env  # Add your API_KEY_EMBED

# Frontend Static Deployment
# Build the frontend locally
cd packages/client
bun install && bun run build

# Deploy static files to Fly.io
fly launch --generate-name --region sjc
fly deploy
