import ollama from 'ollama'

export async function generateEmbedding(text: string) {
  const response = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  })

  return response
}

export function generateReponse(userQuery: string, searchResult: string) {
  const prompt = `You are an AI assistant that helps users find the **top 5 anime** based on the **search results** and respect on the search ranking and the **user query**.

**Response Guidelines:**
- NEED to Reponse in the same language as the user query
- Provide a **concise, relevant** list of **up to 5 anime** based on the search results.
- Prioritize the **most relevant** match first.
- If no exact match is found, suggest the **closest relevant anime**.
- Maintain the **same language** as the user query.
- Format responses as a **clear, structured list**.
- Keep the original names of the anime titles.
---
**Search Results (from MongoDB Vector Search):**
<START - Search Results>
${searchResult}
<END - Search Results>

<START - User Query>
${userQuery}
<END - User Query>

### **Instructions:**
1. **Determine the language** of the user query.
2. Generate a ranked list of up to **5 recommended anime** based on the **search results**.
3. The **first anime** should be the most relevant match. If no perfect match is found, suggest the closest alternatives.
4. **Ensure the response is in the same language as the user query**.`

console.log('Prompt:', prompt)
  //
  // Generate a response based on the prompt
  const response = ollama.generate({
    model: 'deepseek-r1:14b',
    // model: 'phi4',
    stream: true,
    prompt,
  })

  return response
}