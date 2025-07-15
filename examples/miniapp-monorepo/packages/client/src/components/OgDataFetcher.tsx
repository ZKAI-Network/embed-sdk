import { useEffect } from "react"
import { trpc } from "../trpc"

import type { OgDataState, OgData } from "@embed-ai/react"

interface OgDataFetcherProps {
  url: string
  onData: (url: string, ogState: OgDataState) => void
}

export const OgDataFetcher = ({ url, onData }: OgDataFetcherProps) => {
  const { data, isLoading, error } = trpc.getOgData.useQuery({ url })

  useEffect(() => {
    const state: OgDataState = {
      isLoading,
      data: data as OgData | undefined,
      error,
    }
    onData(url, state)
  }, [url, data, isLoading, error, onData])

  return null // This component does not render anything
}
