import { config } from 'dotenv'
import { client, connectDB, db } from './config/mongo'
import { generateEmbedding } from './services/ollama'

config()

async function main() {
  const input = process.argv[2]
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
    ]).toArray()

  console.log(results?.map(r => r.title))
  await client?.close()
}

main()