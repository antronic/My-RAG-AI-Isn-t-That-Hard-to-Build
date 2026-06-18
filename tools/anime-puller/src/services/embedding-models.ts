import { config } from 'dotenv'

config()

export type EmbeddingModelKey = 'azure-openai' | 'ollama' | 'voyage'

export interface EmbeddingModelConfig {
  modelName: string
  collectionName: string
  vectorIndex: {
    name: string
    path: string
  }
}

export const embeddingModels: Record<EmbeddingModelKey, EmbeddingModelConfig> = {
  'azure-openai': {
    modelName: 'azure_openai_gpt-ada-002',
    collectionName: 'embedded_aoai_anime_list',
    vectorIndex: {
      name: 'content_rating_filter',
      path: 'content_embedding',
    },
  },
  'ollama': {
    modelName: 'nomic-embed-text',
    collectionName: 'embedded_nomic_anime_list',
    vectorIndex: {
      name: 'content_rating_filter',
      path: 'content_embedding',
    },
  },
  'voyage': {
    modelName: process.env.VOYAGE_AI_EMBEDDING_MODEL || 'voyage-4-large',
    collectionName: 'embedded_aoai_anime_list',
    vectorIndex: {
      name: 'autoembed_index_1',
      path: 'synopsis',
    },
  },
}

export function resolveEmbeddingModelKey(textEmbeddingAi?: string): EmbeddingModelKey {
  const key = (textEmbeddingAi || process.env.TEXT_EMBEDDING_AI) as EmbeddingModelKey
  if (!key || !(key in embeddingModels)) {
    throw new Error(`Unsupported TEXT_EMBEDDING_AI provider: ${key}`)
  }
  return key
}

export function getEmbeddingModelConfig(textEmbeddingAi?: string): EmbeddingModelConfig {
  return embeddingModels[resolveEmbeddingModelKey(textEmbeddingAi)]
}
