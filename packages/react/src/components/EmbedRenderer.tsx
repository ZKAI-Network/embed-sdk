import ImageGallery from "./ImageGallery.js";
import { LocationCard } from "./LocationCard.js";
import { UrlEmbed } from "./UrlEmbed.js";
import { VideoPlayer } from "./VideoPlayer.js";

export function EmbedRenderer({embed_items}: {embed_items: string[]}) {
  const images: Array<string> = [];
  const videos: Array<string> = [];
  const otherEmbeds: Array<string> = [];

  embed_items.forEach((embed) => {
    const imageExtensions = /\.(jpeg|jpg|gif|png|webp)$/i;
    const videoExtensions = /\.(mp4|webm|m3u8)$/i;

    if (videoExtensions.test(embed)) {
      videos.push(embed);
      return;
    }

    let isImage =
      imageExtensions.test(embed) || embed.includes("/ipfs/");
    if (!isImage) {
      try {
        const url = new URL(embed);
        if (url.hostname === "imagedelivery.net") {
          isImage = true;
        }
      } catch {
        // Not a valid URL, ignore
      }
    }

    if (isImage) {
      images.push(embed);
    } else {
      otherEmbeds.push(embed);
    }
  });

  return (
    <div className="space-y-3 pt-2">
      {videos.map((videoUrl) => (
        <VideoPlayer key={`video-${videoUrl}`} src={videoUrl} />
      ))}
      {images.length > 0 && <ImageGallery images={images} />}
      {otherEmbeds.map((embed) => {
        // Handle geographic location URLs
        if (embed.startsWith("geo:")) {
          return <LocationCard key={`geo-${embed}`} geoUrl={embed} />;
        }
        return (
          <UrlEmbed
            key={`url-${embed}`}
            url={embed}
            isLoading={false}
          />
        );
      })}
    </div>
  );
}
