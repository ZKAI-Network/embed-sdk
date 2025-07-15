import { IconExternalLink, IconMap, IconMapPin, IconNavigation } from "@tabler/icons-react"
import { Button } from "./button.js"
import { Card, CardContent } from "./card.js"

interface LocationCardProps {
  geoUrl: string
}

interface ParsedLocation {
  lat: number
  lng: number
  placeId?: string
  query?: string
}

function parseGeoUrl(geoUrl: string): ParsedLocation | null {
  try {
    // Handle geo:lat,lng or geo:lat,lng?query format
    const geoMatch = geoUrl.match(/^geo:([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)(\?(.+))?$/)

    if (!geoMatch) return null

    const lat = parseFloat(geoMatch[1])
    const lng = parseFloat(geoMatch[2])
    const queryString = geoMatch[4]

    if (isNaN(lat) || isNaN(lng)) return null

    const result: ParsedLocation = { lat, lng }

    if (queryString) {
      const params = new URLSearchParams(queryString)
      result.placeId = params.get("place_id") || undefined
      result.query = params.get("q") || undefined
    }

    return result
  } catch {
    return null
  }
}

function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S"
  const lngDir = lng >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`
}

function getMapUrls(lat: number, lng: number) {
  return {
    google: `https://www.google.com/maps?q=${lat},${lng}`,
    apple: `https://maps.apple.com/?q=${lat},${lng}`,
    openstreetmap: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`
  }
}

export function LocationCard({ geoUrl }: LocationCardProps) {
  const location = parseGeoUrl(geoUrl)

  if (!location) {
    return (
      <Card className="border">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-md flex items-center justify-center">
              <IconMapPin size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600">Invalid Location</p>
              <p className="text-xs text-muted-foreground">Could not parse location data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { lat, lng, placeId } = location
  const mapUrls = getMapUrls(lat, lng)

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Location Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <IconMap size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-base mb-1 flex items-center gap-2">
              <IconMapPin size={16} className="text-red-500" />
              Location
            </h4>
            <p className="text-sm text-muted-foreground font-mono">
              {formatCoordinates(lat, lng)}
            </p>
          </div>
        </div>

        {/* Place ID if available */}
        {placeId && (
          <div className="mb-4 p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Place ID:</strong> {placeId.substring(0, 30)}...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => window.open(mapUrls.google, "_blank")}
          >
            <IconNavigation size={14} className="mr-2" />
            Google Maps
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => window.open(mapUrls.apple, "_blank")}
          >
            <IconExternalLink size={14} className="mr-2" />
            Apple Maps
          </Button>
        </div>

        {/* Additional option */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => window.open(mapUrls.openstreetmap, "_blank")}
        >
          Open in OpenStreetMap
        </Button>
      </CardContent>
    </Card>
  )
}
