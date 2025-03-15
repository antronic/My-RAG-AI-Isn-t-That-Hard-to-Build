import { Elysia, t } from 'elysia'

import { main as search } from '../tools/anime-puller/src/search'
import cors from '@elysiajs/cors'
import { chatStore } from '../tools/anime-puller/src/chat/store'
import { generateReponse } from '../tools/anime-puller/src/services/ollama'
import { generateReponse as generateOpenAIReponse } from '../tools/anime-puller/src/services/azure-openai'
import { ChatMessage } from '../tools/anime-puller/src/chat/types'
import { config } from 'dotenv'

config()

// Server configuration
const PORT = process.env.PORT || 9009

// Create Chat Session (Hardcoded for now)
chatStore.createSession('1')

// Create a new Elysia server
const app = new Elysia()
  // Search endpoint: GET /search?q=<search term>
  // Returns an array of anime matches based on vector similarity
  .get('/search', async (req) => {
      const input = req.query.q as string
      // Perform vector similarity search and return matches
      const result = await search(input) as string[]
      return result.map(r => JSON.parse(r))
  })
  //
  // Chat endpoint: GET /chat?sessionId=<session id>
  // Returns the chat session with the given session id
  .get('/chat', ({ query }) => {
    // Extract the session id from the query parameters
    let sessionId = query.sessionId as string
    // If no session id is provided, generate a new session id and create a new session
    if (!sessionId) {
      // Generate a new session id
      sessionId = chatStore.generateSessionId()
      // Create a new chat session
      chatStore.createSession(sessionId)
    }
    // Return the chat session
    chatStore.getSession(sessionId)
    return { sessionId, messages: chatStore.getMessages(sessionId) }
  })
  //
  // Chat endpoint: POST /chat
  // Adds a new message to the chat session
  .post('/chat', async function* ({ body }) {
    // Extract the session id, role, and content from the request body
    const sessionId = body!.sessionId as string
    const role = body!.role as ChatMessage['role']
    const content = body!.content as string
    // Perform a search based on the content
    const searchResult = await search(content)
    // Add the message to the chat session
    chatStore.addMessage(sessionId, role, content)
    // return chatStore.getSession(sessionId)
    // Generate a response based on the search result
    const streamResult = await generateReponse(content, searchResult!.join('\n'))
    // Yield each response chunk as it is received
    for await (const chunk of streamResult) {
      yield chunk.response
    }
  }
  , {
    body: t.Object({
      sessionId: t.String(),
      role: t.String(),
      content: t.String(),
    })
  })
  //
  // Generate endpoint: POST /generate
  // Returns a generated response based on the input prompt
  .post('/generate', async function *({ body }) {
    // Extract the prompt from the request body
    const prompt = body!.prompt as string
    // Perform a search based on the content
    const searchResult = await search(prompt)
    //
    // Generate a response based on the prompt
    // const stream = await generateOpenAIReponse(prompt, searchResult!.join('\n'))
    const stream = generateOpenAIReponse(prompt, searchResult!.join('\n'))

    // console.log((await stream.next()).value)
    // Yield each response chunk as it is received
    // for await (const chunk of stream) {
    // for await (const chunk of stream) {
    //   yield chunk
    //   // console.log(chunk.toString())
    // }
    return stream
  }, {
    body: t.Object({
      prompt: t.String(),
    })
  })
  //
  // Enable CORS
  .use(cors())
  //
  // Enable JSON body parsing
  // .guard({ parse: 'json' })
  //
  // Start the server and listen for incoming requests
  .listen(PORT, ({ hostname, port }) => {
      console.log(
        `🦊 Elysia is running at ${hostname}:${port}`
      )
  })
//
// Export the app
// This is used in treaty (@elysia/eden) to generate the API types for the client
export type App = typeof app