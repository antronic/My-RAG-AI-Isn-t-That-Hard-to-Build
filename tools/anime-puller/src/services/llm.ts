import { config }  from 'dotenv'

import { generateEmbedding as azureOpenAiGenerateEmbedding } from './azure-openai'
import { generateEmbedding as ollamaGenerateEmbedding } from './ollama'

const TEXT_COMPLETION_AI = process.env.TEXT_COMPLETION_AI
const TEXT_EMBEDDING_AI = process.env.TEXT_EMBEDDING_AI

export async function generateEmbedding(text: string, textEmbeddingAi?: string): Promise<number[]> {
  switch (textEmbeddingAi || TEXT_EMBEDDING_AI) {
    case 'azure-openai':
      {
        const result = await azureOpenAiGenerateEmbedding(text);
        return result.data[0].embedding
      }
    case 'ollama':
      {
        const result = await ollamaGenerateEmbedding(text);

        return result.embedding
      }
    default:
      console.error('Unsupported TEXT_EMBEDDING_AI provider');
      throw new Error('Unsupported TEXT_EMBEDDING_AI provider');
  }
}

export function getModelName(textEmbeddingAi?: string): string {
  switch (textEmbeddingAi || TEXT_EMBEDDING_AI) {
    case 'azure-openai':
      return 'azure_openai_gpt-ada-002'
    case 'ollama':
      return 'nomic-embed-text'
    default:
      throw new Error('Unsupported TEXT_COMPLETION_AI provider');
  }
}

export function getCollectionName(textEmbeddingAi?: string): string {
  switch (textEmbeddingAi || TEXT_EMBEDDING_AI) {
    case 'azure-openai':
      return 'embedded_aoai_anime_list'
    case 'ollama':
      return 'embedded_nomic_anime_list'
    default:
      throw new Error('Unsupported TEXT_EMBEDDING_AI provider');
  }
}