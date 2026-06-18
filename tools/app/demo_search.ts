import { config } from 'dotenv'
import { client, connectDB, db } from '../anime-puller/src/config/mongo'
import { generateEmbedding, getCollectionName, getVectorIndex } from '../anime-puller/src/services/llm'
//
// Load environment variables
config()
//
// Main function
export async function main(search?: string) {
  //
  // Connect to the MongoDB database (throws a clear error if it fails)
  await connectDB()
  //
  // Get the search query from the command line arguments
  const input = search || process.argv[2]
  //
  // Get the log option from the command line arguments
  // Default to 'full' if not provided
  // ---
  // full = log all search results
  // summary = log only the title, rating, and URL of search results
  const logOption = process.argv[3] || 'full'
  console.log('🔎 Searching...', input)
  console.log('🕵️‍♀️ Helping by...', process.env.TEXT_EMBEDDING_AI)
  console.log('⚙️ Converting...', input)
  //
  // Generate the embedding for the search query
  const inputEmbedding = await generateEmbedding(input, process.env.TEXT_EMBEDDING_AI, 'query')
  console.log(inputEmbedding)
  //
  // Resolve the vector index name and path based on the configured embedding model
  const vectorIndex = getVectorIndex()
  //
  // Perform the vector search
  const results = await db!.collection(getCollectionName())
    .aggregate([
      {
        $vectorSearch: {
          index: vectorIndex.name,
          path: vectorIndex.path,
          queryVector: inputEmbedding,
          numCandidates: 1000,
          limit: 500,
          // Filter out results with a rating 'R'
          filter: {
            rating: {
              $nin: [
                "R - 17+ (violence & profanity)",
                "R+ - Mild Nudity",
                "Rx - Hentai",
                ],
            }
          }
        },
      },
      {
        $project: {
          score: { $meta: 'vectorSearchScore' },
          synopsis_embedding: 0,
        },
      },
    ]).toArray()
  //
  // Log the search results
  console.log(`\n📚 Found ${results?.length} results for "${input}"\n`)
  //
  if (logOption === 'full') {
    // Log the search results
    console.log(results)
  } else if (logOption === 'compact') {
    // Log the search results, only showing the title, rating, and URL
    console.log(results?.map(r => ({ title: r.title, rating: r.rating, url: r.url })))
  }
  //
  // Close the MongoDB connection
  await client?.close()
  //
  // Return the search results
  return results
}

main().catch((error) => {
  console.error('💥 Search failed:', (error as Error).message)
  process.exit(1)
})
