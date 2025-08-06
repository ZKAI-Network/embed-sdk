interface UserSearchResult {
  user_id: string
  score: number
  count?: number
  ratio?: number
}

interface UserCardProps {
  user: UserSearchResult
  bulkFarcasterData?: any
  bulkLabelsData?: any
  isLoadingBulkFarcaster?: boolean
  isLoadingBulkLabels?: boolean
}

export function UserCard({
  bulkFarcasterData,
  bulkLabelsData,
  isLoadingBulkFarcaster = false,
  isLoadingBulkLabels = false,
  user,
}: UserCardProps) {
  // Extract user-specific data from bulk responses
  const farcasterData = bulkFarcasterData?.results?.[user.user_id]
    ? {
      results: bulkFarcasterData.results[user.user_id],
      parameters: { fid: user.user_id },
    }
    : null

  const labelsData =
    bulkLabelsData?.results?.find((result: any) => result.fid === user.user_id)
      ? {
        results: [
          bulkLabelsData.results.find((result: any) =>
            result.fid === user.user_id
          ),
        ],
        parameters: { fid: user.user_id },
      }
      : null

  const isLoadingProfile = isLoadingBulkFarcaster
  const isLoadingLabels = isLoadingBulkLabels

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
                // eslint-disable-next-line local-advanced/prefer-effect-constructors
                Array.from({ length: 3 }).map((_unused, i) => (
                  <div key={i} className="skeleton h-6 w-20 rounded-full">
                  </div>
                ))
              )
              : labelsData?.results.length
                  && labelsData.results[0]?.ai_labels?.topics
              ? (
                labelsData.results[0].ai_labels.topics.slice(0, 3).map((
                  topic: any,
                  index: number,
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
