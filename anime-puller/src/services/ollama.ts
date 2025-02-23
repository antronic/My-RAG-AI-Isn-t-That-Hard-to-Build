import ollama from 'ollama'

export async function generateEmbedding(text: string) {
  const response = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  })

  return response
}

export function generateReponse(prompt: string) {
  const response = ollama.generate({
    model: 'deepseek-r1',
    stream: true,
    prompt,
  })

  return response
}