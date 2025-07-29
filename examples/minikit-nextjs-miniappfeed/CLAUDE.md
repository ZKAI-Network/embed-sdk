# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager and Runtime
- **USE BUN!** Always use `bun` as the package manager and runtime for scripts and commands
- Install dependencies with `bun install` 
- Run scripts with `bun run <script>`

## Common Development Commands

### Development
```bash
bun run dev          # Start development server
bun run build        # Build for production  
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Environment Setup
- Use `npx create-onchain --manifest` to regenerate Farcaster Account Association environment variables
- All environment variables are documented in README.md

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **UI**: React 18 + Tailwind CSS with custom theme
- **Blockchain**: Wagmi + Viem on Base chain
- **MiniKit**: Farcaster Mini App integration via @coinbase/onchainkit
- **AI Feeds**: @embed-ai/react and @embed-ai/sdk for personalized content
- **Data**: TanStack React Query for state management
- **Notifications**: Redis-backed system via Upstash

### Key Components Architecture
- **MiniKitProvider**: Root provider in `app/providers.tsx` handles Wagmi, React Query, and MiniKit setup
- **Feed System**: `FeedContainer.tsx` with infinite scroll, powered by `useFeedData.ts` hook
- **MiniApp Embeds**: `MiniAppEmbedRenderer.tsx` renders MiniApp components within feed items
- **Custom Cards**: `CustomFeedCard.tsx` integrates Embed.ai feeds with MiniApp functionality

### API Routes
- `/api/feed` - Fetches personalized feed data using Embed.ai SDK
- `/api/notify` - Sends frame notifications via Redis
- `/api/webhook` - Webhook handling for background processing

### Critical Files
- `app/layout.tsx` - MiniKit metadata configuration and root providers
- `app/page.tsx` - Main app with tab navigation (Home/Features)
- `lib/notification-client.ts` - Frame notification utilities
- `app/utils/miniapp.ts` - MiniApp URL detection (currently placeholder)

### Theming System
- Custom CSS variables in `app/theme.css` for OnchainKit integration
- Supports light/dark mode through OnchainKit theme system
- Pixel font (Pixelify Sans) integration

## Development Notes
- This is a Farcaster Mini App template with AI-powered feeds
- Environment variables must be configured for full functionality
- Redis integration is optional but enables notification features
- Follow Next.js 15 patterns and React 18 conventions
