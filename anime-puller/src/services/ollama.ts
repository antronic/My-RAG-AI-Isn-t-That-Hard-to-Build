import ollama from 'ollama'

export async function generateEmbedding(text: string) {
  const response = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  })

  return response
}

export function generateReponse(prompt: string, searchResult: string) {
  const response = ollama.generate({
    model: 'deepseek-r1',
    stream: true,
    prompt: `You are an AI assistant helping users find anime based on their input and the synopsis of existing anime.
---
Search Results from MongoDB Vector Search:
${searchResult}
---
User Query:
${prompt}

Using the above information, generate a concise and relevant anime recommendation. If no exact match is found, suggest the closest relevant anime.
    `,
  })

  return response
}