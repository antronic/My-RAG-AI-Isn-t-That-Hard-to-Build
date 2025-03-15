import axios from 'axios'
import { config } from 'dotenv'

// Load environment variables
config()

// Type for the expected response
interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
}

export async function generateEmbedding(text: string): Promise<EmbeddingResponse> {
  const endpoint = `https://${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}/embeddings?api-version=2023-05-15`
  // console.log('Endpoint:', endpoint)

  try {
    const response = await axios.post<EmbeddingResponse>(
      endpoint,
      { input: text },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

export async function* generateReponse(userQuery: string, searchResult: string) {
  const endpoint = `https://${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_COMPLETION_DEPLOYMENT_NAME}/chat/completions?api-version=2023-07-01-preview`

  const messages = [
    {
      role: "system",
      content: `You are an anime recommendation assistant that provides recommendations in the same language as the user's query.
**Response Guidelines:**
- NEED to Reponse in the same language as the user query
- Provide a **concise, relevant** list of **up to 5 anime** based on the search results.
- Prioritize the **most relevant** match first.
- If no exact match is found, suggest the **closest relevant anime**.
- Maintain the **same language** as the user query.
- Format responses as a **clear, structured list**.
- Keep the original names of the anime titles and make it as a link from search results.
- Include the high quality image of the anime.
- You need to be friendly and engaging, your gender is female, with emoji and memes.
- Provide a brief description of why you recommend the anime
- Return as markdown
- Limit 1000 tokens
      `
    },
    {
      role: "user",
      content: `Based on these search results:
${searchResult}

Please recommend anime for this query: ${userQuery}`
    }
  ]

  try {
    //
    const response = await axios.post(
      endpoint,
      {
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
        responseType: 'stream'
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Error generating response:', error.status)
    throw new Error('Failed to generate response')
  }
}

// generateReponse('anime recommendations', '1. Attack on Titan\n2. My Hero Academia\n3. One Punch Man\n4. Naruto\n5. Dragon Ball Z')
//   .next()
//   .then(({ value }) => console.log('Value:', value))
//   .catch(error => console.error('Error:', error))