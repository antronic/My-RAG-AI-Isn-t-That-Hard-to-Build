import { config } from 'dotenv'
import { client, connectDB, db } from '../anime-puller/src/config/mongo'
//
// Load environment variables
config()
//
// Atlas Vector Search with AUTO EMBEDDING.
// ---
// With an auto-embedding index, Atlas embeds both the stored field and the
// query text for us. So at query time we simply pass the raw text via `query`
// (like a normal text search) instead of pre-computing a `queryVector`.
const AUTO_EMBED_INDEX = process.env.AUTO_EMBED_INDEX || 'autoembed_index_1'
const AUTO_EMBED_PATH = process.env.AUTO_EMBED_PATH || 'synopsis'
const AUTO_EMBED_COLLECTION = process.env.AUTO_EMBED_COLLECTION || 'raw_anime_list'
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
  // compact = log only the title, rating, and URL of search results
  const logOption = process.argv[3] || 'full'
  console.log('🔎 Searching (auto-embedding)...', input)
  console.log('🧭 Index:', AUTO_EMBED_INDEX, '| Path:', AUTO_EMBED_PATH, '| Collection:', AUTO_EMBED_COLLECTION)
  //
  // Perform the vector search.
  // Note: we pass `query` (raw text) instead of `queryVector` — Atlas embeds it for us.
  const results = await db!.collection(AUTO_EMBED_COLLECTION)
    .aggregate([
      {
        $vectorSearch: {
          index: AUTO_EMBED_INDEX,
          path: AUTO_EMBED_PATH,
          query: input,
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
        // Attach the relevance score without dropping the document fields.
        // (Don't mix inclusion + exclusion in a single $project.)
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
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
  //
  // Log the search results
  console.log(`\n📚 Found ${results?.length} results for "${input}"\n`)
  //
  if (logOption === 'full') {
    // Log the search results
    console.log(results)
  } else if (logOption === 'compact') {
    // Log the search results, only showing the title, rating, and URL
    console.log(results?.map(r => ({ title: r.title, rating: r.rating, url: r.url, score: r.score })))
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
