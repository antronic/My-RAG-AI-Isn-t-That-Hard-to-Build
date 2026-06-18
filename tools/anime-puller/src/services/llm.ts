import { config }  from 'dotenv'

import { generateEmbedding as azureOpenAiGenerateEmbedding } from './azure-openai'
import { generateEmbedding as ollamaGenerateEmbedding } from './ollama'
import { generateEmbedding as voyageGenerateEmbedding } from './voyage'
import { getEmbeddingModelConfig, resolveEmbeddingModelKey } from './embedding-models'

config()

export async function generateEmbedding(
  text: string,
  textEmbeddingAi?: string,
  inputType: 'query' | 'document' = 'document',
): Promise<number[]> {
  switch (resolveEmbeddingModelKey(textEmbeddingAi)) {
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
    case 'voyage':
      {
        const result = await voyageGenerateEmbedding(text, inputType);
        return result.data[0].embedding
      }
  }
}

export function getModelName(textEmbeddingAi?: string): string {
  return getEmbeddingModelConfig(textEmbeddingAi).modelName
}

export function getCollectionName(textEmbeddingAi?: string): string {
  return getEmbeddingModelConfig(textEmbeddingAi).collectionName
}

export function getVectorIndex(textEmbeddingAi?: string): { name: string; path: string } {
  return getEmbeddingModelConfig(textEmbeddingAi).vectorIndex
}