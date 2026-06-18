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

// https://www.mongodb.com/docs/voyageai/models/text-embeddings/?client=typescript
// MongoDB Atlas-issued Voyage AI keys must hit the MongoDB-hosted endpoint.
// Direct Voyage AI keys should set VOYAGE_AI_ENDPOINT=https://api.voyageai.com/v1/embeddings
const VOYAGE_ENDPOINT = process.env.VOYAGE_AI_ENDPOINT || 'https://ai.mongodb.com/v1/embeddings'
const VOYAGE_MODEL = process.env.VOYAGE_AI_EMBEDDING_MODEL || 'voyage-4-large'

export async function generateEmbedding(text: string, inputType: 'query' | 'document' = 'document'): Promise<EmbeddingResponse> {
  console.log('Generating embedding for text:', text, 'using Voyage AI', 'model:', VOYAGE_MODEL, 'at endpoint:', VOYAGE_ENDPOINT)
  try {
    const response = await axios.post<EmbeddingResponse>(
      VOYAGE_ENDPOINT,
      {
        input: text,
        model: VOYAGE_MODEL,
        input_type: inputType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VOYAGE_AI_API_KEY}`,
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}
