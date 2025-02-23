import { Elysia, t } from 'elysia'
import { node } from '@elysiajs/node'

import { main as search } from './search'
import cors from '@elysiajs/cors'
import { chatStore } from './chat/store'
import { generateReponse } from './services/ollama'
import Stream from '@elysiajs/stream'
import ollama from 'ollama'

// Server configuration
const PORT = process.env.PORT || 9009

chatStore.createSession('1')

new Elysia({ adapter: node() })
    // Search endpoint: GET /search?q=<search term>
    // Returns an array of anime matches based on vector similarity
    .get('/search', async (req) => {
        const input = req.query.q as string

        // Perform vector similarity search and return matches
        const result = await search(input) as any[]
				return result
    })

		.post('/generate', async function *({ body }) {
      const prompt = body!.prompt as string

      const stream = await generateReponse(prompt)

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