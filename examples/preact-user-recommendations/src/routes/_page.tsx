import { useQuery } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import { UserCard } from "../components/UserCard"

interface UserSearchResult {
  user_id: string
  score: number
  count?: number
  ratio?: number
}

interface SearchResponse {
  results: Array<UserSearchResult>
  search_type: "semantic" | "label"
  parameters: any
}

const TOPIC_LABELS = [
  "arts_culture",
  "business_entrepreneurs",
  "celebrity_pop_culture",
  "diaries_daily_life",
  "family",
  "fashion_style",
  "film_tv_video",
  "fitness_health",
  "food_dining",
  "gaming",
  "learning_educational",
  "music",
  "news_social_concern",
  "other_hobbies",
  "relationships",
  "science_technology",
  "sports",
  "travel_adventure",
  "youth_student_life",
]

export default function() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLabel, setSelectedLabel] = useState("")
  const [searchType, setSearchType] = useState<"query" | "label">("query")

  const searchUsers = async (params: any): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams()

    if (params.query) {
      queryParams.set("semantic", "true")
      queryParams.set("query", params.query)
    } else if (params.label) {
      queryParams.set("semantic", "false")
      queryParams.set("topic", params.label)
    }

    const response = await fetch(`/api/users?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to search users")
    }

    return response.json()
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["users", searchType, searchQuery, selectedLabel],
    queryFn: () =>
      searchUsers({
        ...(searchType === "query"
          ? { query: searchQuery }
          : { label: selectedLabel }),
      }),
    enabled: searchType === "query" ? !!searchQuery : !!selectedLabel,
  })

  const handleSearch = (e: Event) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-500 to-base-100 p-3 lg:p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mt-8 mb-4 lg:mb-6 flex justify-center">
          <h1 className="text-xl lg:text-2xl font-bold text-base-content">
            Discover Users
          </h1>
        </div>

        {/* Search Form */}
        <div className="bg-base-200 rounded-lg p-4 lg:p-6 mb-4 lg:mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Toggle */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className={`btn ${
                  searchType === "query"
                    ? "btn-primary"
                    : "btn-outline btn-primary"
                }`}
                onClick={() => setSearchType("query")}
              >
                Semantic Search
              </button>
              <button
                type="button"
                className={`btn ${
                  searchType === "label"
                    ? "btn-primary"
                    : "btn-outline btn-primary"
                }`}
                onClick={() => setSearchType("label")}
              >
                By Topic Label
              </button>
            </div>

            <div className="space-y-4">
              {searchType === "query"
                ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Search by interests (e.g., 'web3 developers')"
                      className="input input-bordered w-full"
                      value={searchQuery}
                      onInput={(e) =>
                        setSearchQuery(
                          (e.target as HTMLInputElement)
                            .value,
                        )}
                    />
                  </div>
                )
                : (
                  <div className="space-y-3">
                    <select
                      className="select select-bordered w-full"
                      value={selectedLabel}
                      onChange={(e) =>
                        setSelectedLabel(
                          (e.target as HTMLSelectElement)
                            .value,
                        )}
                    >
                      <option value="">
                        Select a topic label
                      </option>
                      {TOPIC_LABELS.map((label) => (
                        <option key={label} value={label}>
                          {label
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) =>
                              l
                                .toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="loading loading-spinner loading-lg mb-4">
            </div>
            <p className="text-base-content/60">
              Searching users...
            </p>
          </div>
        )}

        {error && (
          <div className="alert alert-error max-w-md mx-auto mb-6">
            <span>
              {error.message}
            </span>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.results.map((user, _index) => (
              <UserCard key={user.user_id} user={user} />
            ))}
          </div>
        )}

        {data && data.results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content/60">
              No users found matching your search criteria
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
