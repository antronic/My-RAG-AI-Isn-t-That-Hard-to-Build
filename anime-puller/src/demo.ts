import { connectDB, db } from './config/mongo'
import { generateEmbedding } from './services/ollama'

const data = [
  {
    nickname: 'Job',
    description: 'The man who is working at MongoDb lonely Singapore, and my friend visited at 2am randomly',
  },
  {
    nickname: 'Son',
    description: 'The man who was student in Japan',
  },
]

async function main() {
  for (const d of data) {
    const vector = await generateEmbedding(JSON.stringify(d.description))

    await connectDB()

    await db?.collection('people')
      .insertOne({
        ...d,
        embedding: vector.embedding,
      })
  }
}

async function search(q?: string) {
  const input = q || process.argv[2]
  console.log('Converting...', input)

  const inputEmbedding = await generateEmbedding(input)

  await connectDB()
  console.log('Searching...', input)

  const results = await db?.collection('people')
      .aggregate([
        {
          $vectorSearch: {
            index: 'default',
            path: 'embedding',
            queryVector: inputEmbedding.embedding,
            numCandidates: 500,
            limit: 100,
          },
        },
        // Include search score
        {
          $project: {
            embedding: 0,
          },
        },
        {
          $match: {
            rating: {
              $not: '/^R/i'
            }
          }
        },
      ]).toArray()

    console.log(results?.map(r => ({ nickname: r.nickname })))
}

// main()
search()