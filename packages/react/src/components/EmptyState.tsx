import { Card, CardContent } from "./card.js"

export function EmptyState() {
  return (
    <Card className="border">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground font-medium">No posts available</p>
          <p className="text-muted-foreground text-sm">
            Check back later for new content
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
