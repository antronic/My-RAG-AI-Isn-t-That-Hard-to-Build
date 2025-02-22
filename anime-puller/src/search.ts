import { config } from 'dotenv'
import { client, connectDB, db } from './config/mongo'
import { generateEmbedding } from './services/ollama'

config()

export async function main(search?: string) {
  const input = search || process.argv[2]
  console.log('Converting...', input)

  const inputEmbedding = await generateEmbedding(input)

  // console.log('vector...', inputEmbedding.embedding)
  await connectDB()
  console.log('Searching...', input)

  const results = await db?.collection('anime_list')
    .aggregate([
      {
        $vectorSearch: {
          index: 'default',
          path: 'synopsis_embedding',
          queryVector: inputEmbedding.embedding,
          numCandidates: 500,
          limit: 100,
        },
      },
      // Include search score
      {
        $project: {
          synopsis_embedding: 0,
        },
      },
      {
        $match: {
          rating: {
            $not: /^R/i,
          }
        }
      },
    ]).toArray()

  console.log(results?.map(r => ({ title: r.title, rating: r.rating})))
  // console.log(results)
  await client?.close()

  return results
}

// main()