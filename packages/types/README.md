# @embed-ai/types

TypeScript types for Embed AI APIs, providing comprehensive type definitions for Farcaster feed management, AI labeling, and content filtering.

## Installation

```bash
npm install @embed-ai/types
```

## Usage

### Basic Import (All Types)

```typescript
import type { ForYou, ForYouResponse, FeedOptions } from '@embed-ai/types'
```

### Organized Imports by Category

#### Feed Types
```typescript
import type { ForYou, ForYouReranked, popular, trendingNow } from '@embed-ai/types/feeds'
```

#### AI Labeling Types
```typescript
import type { LabelsForItems, LabelsForText, LabelsForUsers } from '@embed-ai/types/labels'
```

#### Search and Filtering Types
```typescript
import type { SemanticSearch, Similar, TopicParam, FiltersParam } from '@embed-ai/types/search'
```

#### User Feed Types
```typescript
import type { UsersFeedForChannel, UsersFeedForItem, UsersFeedForTopic } from '@embed-ai/types/users'
```

#### Response Types
```typescript
import type { ForYouResponse, ForYouApiResponse } from '@embed-ai/types/responses'
```

### Effect Schemas for Runtime Validation

The package also exports Effect schemas for runtime validation and parsing:

```typescript
import { ForYou, ForYouEncoded } from '@embed-ai/types'

// Runtime validation
const result = ForYou.decode(inputData)
if (result._tag === 'Right') {
  // Valid data
  const validatedData = result.right
} else {
  // Invalid data
  console.error('Validation failed:', result.left)
}

// Encoding for API requests
const encodedData = ForYouEncoded.encode(data)
```

#### Available Schemas
- **Request Schemas**: `ForYou`, `ForYouReranked`, `popular`, `trendingNow`, etc.
- **Response Schemas**: `ForYouResponse`, `ForYouApiResponse`
- **Filter Schemas**: `FiltersParam`, `PromotionFiltersParam`, `ScoringParam`
- **Label Schemas**: `LabelsForItems`, `LabelsForText`, `LabelsForUsers`
- **Search Schemas**: `SemanticSearch`, `Similar`, `TopicParam`

Each schema has a corresponding `*Encoded` version for API serialization.

### Feed Management Types

```typescript
import type { 
  CreateFeedOptions, 
  FeedCreateUpdateResponse, 
  FeedGetResponse,
  ListFeedsResponse,
  UpdateFeedOptions 
} from '@embed-ai/types'
```

### Complete Example

```typescript
import type { 
  ForYou, 
  ForYouResponse, 
  FiltersParam,
  LabelsForItems 
} from '@embed-ai/types'

// Or use organized imports
import type { ForYou, ForYouResponse } from '@embed-ai/types/feeds'
import type { FiltersParam } from '@embed-ai/types/search'
import type { LabelsForItems } from '@embed-ai/types/labels'

// Runtime validation
import { ForYou as ForYouSchema } from '@embed-ai/types'
const validationResult = ForYouSchema.decode(requestData)
```

## Type Categories

### Request Parameters
- **Feed Types**: `ForYou`, `ForYouReranked`, `popular`, `trendingNow`
- **Filter Types**: `FiltersParam`, `PromotionFiltersParam`, `ScoringParam`
- **Search Types**: `SemanticSearch`, `Similar`, `TopicParam`
- **User Feed Types**: `UsersFeedForChannel`, `UsersFeedForItem`, `UsersFeedForTopic`, `UsersFeedSimilar`, `UsersSemanticSearch`
- **Label Types**: `LabelsForItems`, `LabelsForText`, `LabelsForUsers`, `LabelsTopItems`, `LabelsTopUsers`

### Response Types
- **Feed Responses**: `ForYouResponse`, `ForYouApiResponse`
- **Feed Management**: `FeedCreateUpdateResponse`, `FeedGetResponse`, `ListFeedsResponse`

### Configuration Types
- **Feed Management**: `CreateFeedOptions`, `UpdateFeedOptions`
- **Parameters**: `AILabelsFilterParam`, `ColdstartParam`, `Empty`, `FallbackFeedsParam`, `FeedDiversityConfigParam`

## Package Structure

The package provides both a flat export (all types from root) and organized subpath exports:

- `@embed-ai/types` - All types and schemas
- `@embed-ai/types/feeds` - Feed-related types and schemas
- `@embed-ai/types/labels` - AI labeling types and schemas  
- `@embed-ai/types/search` - Search and filtering types and schemas
- `@embed-ai/types/users` - User feed types and schemas
- `@embed-ai/types/responses` - Response types and schemas

## License

BSD-3-Clause 
