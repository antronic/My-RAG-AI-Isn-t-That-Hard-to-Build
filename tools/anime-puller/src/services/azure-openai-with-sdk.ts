import { AzureOpenAI } from 'openai'
import dotenv from 'dotenv'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

dotenv.config()

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"]
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
const apiVersion = "2025-01-01-preview";
const deployment = "gpt-35-turbo"; // This must match your deployment name
const model = "gpt-35-turbo"; // This must match your deployment name

// Response API vs Chat Completions
// https://platform.openai.com/docs/guides/responses-vs-chat-completions
export async function generateChatCompletion(searchResult: string, userQuery: string) {
  if (!endpoint) {
    throw new Error("AZURE_OPENAI_ENDPOINT is not defined in environment variables.");
  }

  const client = new AzureOpenAI({ endpoint: `https://${endpoint}`, apiKey, apiVersion, deployment });

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `# Identity
You are an anime recommendation assistant that provides recommendations in the same language as the user's query.
# Instructions
*Response Guidelines
- NEED to Reponse in the same language as the user query
- Must include the image of the anime as Image element.
- Provide a **concise, relevant** list of **up to 5 anime** based on the search results.
- Prioritize the **most relevant** match first.
- If no exact match is found, suggest the **closest relevant anime**.
- Maintain the **same language** as the user query.
- Keep the original names of the anime titles and make it as a link from search results.
- You need to be friendly and engaging, your gender is female, with emoji and memes.
- Provide a brief description of why you recommend the anime
- Return as markdown
- If user asks out of scope question but still related to anime, ignore the search result and provide a response
- Limit 1000 tokens`
    },
    {
      role: "user",
      content: `Based on these search results:
${searchResult}

Please recommend anime for this query: ${userQuery}`
    }
  ]

  const response = await client.chat.completions.create({
    model,
    messages,
    stream: true,
    top_p: 0.5,
    max_tokens: 1000,
    stream_options: {
      include_usage: true,
    }
  })


  // let finalResponse = "";
  // for await (const chunk of response) {
  //   // finalResponse += chunk.choices[0].delta.content
  //   console.log(chunk.choices[0]?.delta.content);
  //   // finalResponse += chunk.choices[0]?.delta.content || "";
  // }

  // return finalResponse;
  return response
}