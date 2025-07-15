import Hls from "hls.js"
import React, { useEffect, useRef } from "react"

interface VideoPlayerProps {
  className?: string
  src: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ className, src }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (src.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
      }
    } else {
      video.src = src
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      controls
      className={className || "w-full h-auto rounded-lg border bg-black"}
      playsInline
      style={{ maxHeight: "70vh" }}
    />
  )
}

export { VideoPlayer }
