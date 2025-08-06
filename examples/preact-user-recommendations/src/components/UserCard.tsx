import type { UserLabelsResponse } from "@embed-ai/types"
import { useQuery } from "@tanstack/react-query"

interface UserSearchResult {
  user_id: string
  score: number
  count?: number
  ratio?: number
}

interface FarcasterUserData {
  results: {
    pfp?: string
    username?: string
  }
  parameters: { fid: string }
}

interface UserLabelsData {
  results: UserLabelsResponse
  parameters: { fid: string }
}

interface UserCardProps {
  user: UserSearchResult
}

export function UserCard({ user }: UserCardProps) {
  const { data: farcasterData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["farcaster", user.user_id],
    queryFn: async (): Promise<FarcasterUserData> => {
      const response = await fetch(`/api/farcaster?fid=${user.user_id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }
      return response.json()
    },
  })

  const { data: labelsData, isLoading: isLoadingLabels } = useQuery({
    queryKey: ["labels", user.user_id],
    queryFn: async (): Promise<UserLabelsData> => {
      const response = await fetch(`/api/labels?fid=${user.user_id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user labels")
      }
      return response.json()
    },
  })

  return (
    <div className="card bg-base-800 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body">
        {/* Header with Profile Picture and Username */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              {isLoadingProfile
                ? (
                  <div className="skeleton w-16 h-16 rounded-full">
                  </div>
                )
                : farcasterData?.results.pfp
                ? (
                  <img
                    src={farcasterData
                      .results
                      .pfp}
                    alt="Profile"
                    className="rounded-full"
                  />
                )
                : (
                  <div className="bg-base-300 flex items-center justify-center w-16 h-16 rounded-full">
                    <span className="text-base-content/50 text-2xl">
                      👤
                    </span>
                  </div>
                )}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">
              {isLoadingProfile
                ? (
                  <div className="skeleton h-4 w-24">
                  </div>
                )
                : (
                  farcasterData?.results.username || `User ${user.user_id}`
                )}
            </div>
            <div className="text-xs text-base-content/60">
              FID: {user.user_id}
            </div>
          </div>
        </div>

        {/* User Labels */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 text-base-content/80">
            Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {isLoadingLabels
              ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-6 w-20 rounded-full">
                  </div>
                ))
              )
              : labelsData?.results.length
                  && labelsData.results[0]?.ai_labels?.topics
              ? (
                labelsData.results[0].ai_labels.topics.slice(0, 3).map((
                  topic,
                  index,
                ) => (
                  <div
                    key={index}
                    className="badge badge-primary badge-sm"
                    title={`Score: ${
                      (topic.score * 100).toFixed(1)
                    }%`}
                  >
                    {topic.label.replace(/_/g, " ")}
                  </div>
                ))
              )
              : (
                <div className="text-xs text-base-content/50 italic">
                  No labels available
                </div>
              )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats stats-horizontal stats-compact w-full bg-base-200">
          <div className="stat">
            <div className="stat-title text-xs">
              Relevance
            </div>
            <div className="stat-value text-sm text-accent">
              {(user.score * 100).toFixed(1)}%
            </div>
          </div>
          {user.count && (
            <div className="stat">
              <div className="stat-title text-xs">
                Activity
              </div>
              <div className="stat-value text-sm">
                {user.count}
              </div>
            </div>
          )}
          {user.ratio && (
            <div className="stat">
              <div className="stat-title text-xs">
                Ratio
              </div>
              <div className="stat-value text-sm">
                {(user.ratio * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
