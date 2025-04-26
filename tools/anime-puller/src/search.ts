import { config } from 'dotenv'
import { client, connectDB, db } from './config/mongo'
import { generateEmbedding, getCollectionName } from './services/llm'

config()

connectDB()

type SearchOptions = {
  safeSearch?: boolean
}
export async function search(search?: string, model?: string, options?: SearchOptions) {
  const safeSearch = options?.safeSearch ?? true
  const input = search || process.argv[2]
  console.log('Converting with model:', model, '...', input)

  const inputEmbedding = await generateEmbedding(input, model)
  console.log('Searching...', input)

  let filter = {}

  if (safeSearch) {
    filter = {
      rating: {
        $nin: [
          "R - 17+ (violence & profanity)",
          "R+ - Mild Nudity",
          "Rx - Hentai",
        ],
      }
    }
  }

  const results = await db?.collection(getCollectionName(model))
    .aggregate([
      {
        $vectorSearch: {
          index: 'synopsis_rating_filter',
          path: 'synopsis_embedding',
          queryVector: inputEmbedding,
          numCandidates: 1000,
          limit: 500,
          // Filter out results with a rating 'R'
          filter,
        },
      },
      {
        $project: {
          score: { $meta: 'vectorSearchScore' },
          synopsis_embedding: 0,
        },
      },
      {
        $project: {
          title: 1,
          synopsis: 1,
          url: 1,
          images: 1,
          image: '$images.jpg.large_image_url',
          rating: 1,
        }
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $limit: 10,
      },
    ]).toArray()

  // return results?.map((r, i) => JSON.stringify(r))
  return results
}

export function normalizedSearchResult(searchResult: any[]) {
  return searchResult!.map(
    (r: any, index: number) => (
      `${index + 1}. Title: ${r.title}
Rating: ${r.rating}
URL: ${r.url}
Images: ${r.image}\n`)
  ).join('\n')
}