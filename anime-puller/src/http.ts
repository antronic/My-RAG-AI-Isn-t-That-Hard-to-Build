import { Elysia, t } from 'elysia'
import { node } from '@elysiajs/node'

import { main as search } from './search'
import cors from '@elysiajs/cors'
import { chatStore } from './chat/store'
import { generateReponse } from './services/ollama'
import { ChatMessage } from './chat/types'

// Server configuration
const PORT = process.env.PORT || 9009

chatStore.createSession('1')

const app = new Elysia({ adapter: node() })
  // .guard({
  //   parse: 'json'
  // })
    // Search endpoint: GET /search?q=<search term>
    // Returns an array of anime matches based on vector similarity
    .get('/search', async (req) => {
        const input = req.query.q as string

        // Perform vector similarity search and return matches
        const result = await search(input) as any[]
				return result
    })

    .get('/chat', ({ query }) => {
      let sessionId = query.sessionId as string

      if (!sessionId) {
        sessionId = chatStore.generateSessionId()
        chatStore.createSession(sessionId)
      }

      chatStore.getSession(sessionId)
      return { sessionId, messages: chatStore.getMessages(sessionId) }
    })

    .post('/chat', async function* ({ body }) {
      const sessionId = body!.sessionId as string
      const role = body!.role as ChatMessage['role']
      const content = body!.content as string

      const searchResult = await search(content)
      chatStore.addMessage(sessionId, role, content)
      // return chatStore.getSession(sessionId)

      const streamResult = await generateReponse(content, searchResult!.join('\n'))

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

		.post('/generate', async function *({ body }) {
      const prompt = body!.prompt as string

      const stream = await generateReponse(prompt, '')

      for await (const chunk of stream) {
        yield chunk.response
      }
    }, {
      body: t.Object({
        prompt: t.String(),
      })
    })

		// Enable CORS
		.use(cors())

    // Start the server and listen for incoming requests
    .listen(PORT, ({ hostname, port }) => {
        console.log(
            `🦊 Elysia is running at ${hostname}:${port}`
        )
    })

export type App = typeof app