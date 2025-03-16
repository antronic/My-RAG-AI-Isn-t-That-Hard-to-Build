import { config } from 'dotenv'
import { client, connectDB, db } from '../anime-puller/src/config/mongo'
import { generateEmbedding } from '../anime-puller/src/services/ollama'
//
// Load environment variables
config()
// Connect to the MongoDB database
connectDB()
//
// Main function
export async function main(search?: string) {
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
  console.log('⚙️ Converting...', input)
  //
  // Generate the embedding for the search query
  const inputEmbedding = await generateEmbedding(input)
  console.log('🔎 Searching...', input)
  //
  // Perform the vector search
  const results = await db?.collection('embedded_anime_list')
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
  //
  // Log the search results
  console.log(`\n📚 Found ${results?.length} results for "${input}"\n`)
  //
  if (logOption === 'full') {
    // Log the search results
    console.log(results)
  } else if (logOption === 'summary') {
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

main()