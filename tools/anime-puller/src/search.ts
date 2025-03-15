import { config } from 'dotenv'
import { client, connectDB, db } from './config/mongo'
import { generateEmbedding } from './services/azure-openai'

config()

connectDB()
export async function main(search?: string) {
  const input = search || process.argv[2]
  console.log('Converting...', input)

  const inputEmbedding = await generateEmbedding(input)
  console.log('Searching...', input)

  const results = await db?.collection('embedded_aoai_anime_list')
    .aggregate([
      {
        $vectorSearch: {
          index: 'default',
          path: 'synopsis_embedding',
          queryVector: inputEmbedding.data[0].embedding,
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

  return results?.map((r, i) => JSON.stringify(r))
}