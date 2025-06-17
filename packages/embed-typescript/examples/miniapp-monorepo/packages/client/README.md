# Farcaster Miniapp Client

This is the React frontend for the Farcaster Miniapp monorepo example using the **Embed SDK**.

## 📖 Documentation

**For complete setup and development instructions, see the [main README](../../README.md).**

## 🏗️ Client-Specific Information

### Tech Stack

- **Embed Personalized Feed** - Core functionality using the Embed SDK
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Mantine UI** - Modern React components library
- **tRPC** - Type-safe API communication
- **Farcaster Frame SDK** - Integration with Farcaster miniapp context

### Environment Variables

Create `.env` in this directory:

```bash
VITE_API_URL=http://127.0.0.1:3000
```

> **Note:** For Farcaster miniapp testing, use your Cloudflare tunnel URL instead. See the [main README](../../README.md#testing-with-farcaster-miniapp) for details.

### Development

From the **monorepo root**, run:

```bash
# Frontend only
bun run dev:client

# Or both frontend and backend
bun dev
```

The frontend will be available at `http://localhost:5173`.

### Key Features

- **Adaptive UI**: Shows different content based on whether it's running in a Farcaster miniapp or demo mode
- **User Context**: Displays user profile information when running in Farcaster
- **Personalized Feed**: Shows personalized content based on user's FID
- **Responsive Design**: Works well on mobile and desktop
- **Real-time Updates**: Uses tRPC for type-safe API communication

### Project Structure

```
src/
├── components/          # React components
│   ├── FeedGrid.tsx    # Main feed display
│   ├── FeedCard.tsx    # Individual feed items
│   ├── FeedHeader.tsx  # App header
│   └── ...
├── hooks/              # Custom React hooks
│   └── useFeedData.ts  # Feed data management
├── FrameProvider.tsx   # Farcaster frame context
├── trpc.ts            # tRPC client setup
└── main.tsx           # App entry point
```

### Development Tips

- The app automatically detects if it's running in a Farcaster miniapp context
- In demo mode, it uses FID 3 for testing
- Hot reload works automatically during development
- Check browser console for API logs and errors

## 🚀 Getting Started

1. **Setup**: Follow the [main README](../../README.md) for complete setup instructions
2. **Development**: Run `bun dev` from the monorepo root
3. **Testing**: Use Cloudflare tunnels for Farcaster miniapp testing (see main README)
