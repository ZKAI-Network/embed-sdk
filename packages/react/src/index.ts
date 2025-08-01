// Main exports - use subpath imports for tree-shaking
// import { Button } from "@embed-ai/react/ui"
// import { FeedCard } from "@embed-ai/react/feed"
// import { VideoPlayer } from "@embed-ai/react/media"
// import { cn } from "@embed-ai/react/utils"

// Most commonly used components for convenience
export { Avatar, AvatarFallback, AvatarImage } from "./components/avatar.js"
export { Badge } from "./components/badge.js"
export { Button } from "./components/button.js"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/card.js"
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./components/dialog.js"
export { EmbedSkeleton } from "./components/EmbedSkeleton.js"
export { Image } from "./components/image.js"
export { VideoPlayer } from "./components/VideoPlayer.js"
export { VisuallyHidden } from "./components/VisuallyHidden.js"
export { cn } from "./lib/utils.js"
