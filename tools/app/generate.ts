import { config } from 'dotenv'
import { client, connectDB, db } from '../anime-puller/src/config/mongo'
import { search } from '../anime-puller/src/search'
import { generateChatCompletion } from '../anime-puller/src/services/azure-openai-with-sdk'
//
// Load environment variables
config()
// Connect to the MongoDB database
connectDB()
//
// Main function
export async function main(searchQuery?: string) {
  //
  // Get the search query from the command line arguments
  const input = searchQuery || process.argv[2]
  console.log('🔎 Searching...', input)
  console.log('🕵️‍♀️ Helping by...', process.env.TEXT_EMBEDDING_AI)
  console.log('⚙️ Converting...', input)
  //
  // Generate the embedding for the search query
  const searchResult = await search(searchQuery)
  // Search result

  // console.log('🔍 Search results:', searchResult)
  const normalizedSearchResult = searchResult!.map(
    (r: any, index: number) => (
      `${index + 1}. Title: ${r.title}
Rating: ${r.rating}
URL: ${r.url}
Images: ${JSON.stringify(r.images)}\n`)
  ).join('\n')

  console.log('📜 Normalized search results:', normalizedSearchResult)
  //
  console.log('🧠 Generating response...')
  const result = await generateChatCompletion(searchResult!.join("\n"), input)
  console.log('💬 Generated response:', result)

  for await (const chunk of result) {
    console.log(chunk.choices[0]?.delta.content);
    // console.log(chunk.choices);
    // finalResponse += chunk.choices[0]?.delta.content || "";;
  }
}

main()