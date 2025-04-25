import { config } from 'dotenv'
import { client, connectDB, db } from './config/mongo'
import { generateEmbedding, getCollectionName } from './services/llm'

config()

connectDB()
export async function search(search?: string) {
  const input = search || process.argv[2]
  console.log('Converting...', input)

  const inputEmbedding = await generateEmbedding(input)
  console.log('Searching...', input)

  const results = await db?.collection(getCollectionName())
    .aggregate([
      {
        $vectorSearch: {
          index: 'default',
          path: 'synopsis_embedding',
          queryVector: inputEmbedding,
          numCandidates: 1000,
          limit: 500,
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
      // Include search score
      {
        $match: {
          rating: {
            $not: /^R/i,
          }
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