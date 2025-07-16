import { IconX } from "@tabler/icons-react"
import React, { useState } from "react"
import { Button, Dialog, DialogContent, DialogTitle, Image, VisuallyHidden } from "../index.js"

interface ImageGalleryProps {
  className?: string
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ className = "", images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!images || images.length === 0) return null

  const openModal = (index = 0) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const renderPreviewGrid = () => {
    const imageCount = images.length

    if (imageCount === 1) {
      // Single large image
      return (
        <div
          className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt="Image"
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
        </div>
      )
    }

    if (imageCount === 2) {
      // Two images side by side
      return (
        <div className="grid grid-cols-2 gap-2 aspect-video">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          ))}
        </div>
      )
    }

    if (imageCount === 3) {
      // 2x2 grid with one empty spot
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-video">
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={images[0]}
              alt="Image 1"
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(1)}
          >
            <Image
              src={images[1]}
              alt="Image 2"
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(2)}
          >
            <Image
              src={images[2]}
              alt="Image 3"
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>
          {/* Empty fourth spot */}
          <div className="relative" />
        </div>
      )
    }

    if (imageCount === 4) {
      // Perfect 2x2 grid
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-video">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          ))}
        </div>
      )
    }

    // 5+ images: Show first 3 with "see more" overlay
    const remainingCount = imageCount - 3
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-video">
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt="Image 1"
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
        </div>
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(1)}
        >
          <Image
            src={images[1]}
            alt="Image 2"
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
        </div>
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(2)}
        >
          <Image
            src={images[2]}
            alt="Image 3"
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              +{remainingCount} more
            </span>
          </div>
        </div>
        {/* Empty fourth spot */}
        <div className="relative" />
      </div>
    )
  }

  const renderModalGallery = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-[92vw] max-w-6xl h-[88vh] max-h-[88vh] p-0 overflow-hidden [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Image Gallery</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background flex-shrink-0">
            <div className="w-10" /> {/* Spacer for balance */}
            <span className="text-sm text-muted-foreground">
              {currentImageIndex + 1} of {images.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsModalOpen(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>

          {/* Main image container */}
          <div className="flex-1 relative flex items-center justify-center bg-black min-h-0 overflow-hidden">
            {/* Blurred background */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${images[currentImageIndex]})`,
                filter: "blur(20px) brightness(0.3)",
                transform: "scale(1.1)" // Prevents blur edge artifacts
              }}
            />

            {/* Main image */}
            <div
              className="relative w-full h-full flex items-center justify-center p-4 z-10"
              style={{
                maxWidth: "calc(92vw - 2rem)",
                maxHeight: "calc(88vh - 140px)" // Account for header and thumbnail strip
              }}
            >
              <img
                src={images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="select-none drop-shadow-lg"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain"
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            {/* No navigation arrows - removed as requested */}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="p-3 sm:p-4 border-t bg-background flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary shadow-md"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className={className}>
      {renderPreviewGrid()}
      {renderModalGallery()}
    </div>
  )
}

export default ImageGallery
