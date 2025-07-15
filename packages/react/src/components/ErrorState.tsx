import { Card, CardContent } from "./card.js"

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Card className="border border-red-200 bg-red-50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">Error loading feed</p>
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
