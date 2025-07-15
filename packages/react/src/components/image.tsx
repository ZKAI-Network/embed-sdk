import { IconPhotoOff } from "@tabler/icons-react"
import * as React from "react"
import { useState } from "react"

import { cn } from "../lib/utils.js"
import { Skeleton } from "./skeleton.js"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string
  src: string
  aspectRatio?: "square" | "video" | "auto"
  fallback?: React.ReactNode
  showSkeleton?: boolean
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      className,
      src,
      aspectRatio = "auto",
      fallback,
      showSkeleton = true,
      ...props
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const handleLoad = () => {
      setLoading(false)
      setError(false)
    }

    const handleError = () => {
      setLoading(false)
      setError(true)
    }

    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      auto: "",
    }

    if (error) {
      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-md border border-border bg-muted text-muted-foreground",
            aspectRatioClasses[aspectRatio],
            className,
          )}>
          {fallback || (
            <div className="flex flex-col items-center justify-center p-4">
              <IconPhotoOff size={24} className="mb-2" />
              <span className="text-xs text-center">Image unavailable</span>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className={cn("relative overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
        {loading && showSkeleton && (
          <Skeleton className={cn("absolute inset-0 w-full h-full", aspectRatioClasses[aspectRatio])} />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            loading ? "opacity-0" : "opacity-100"
          )}
          {...props}
        />
      </div>
    )
  }
)

Image.displayName = "Image"

export { Image } 
