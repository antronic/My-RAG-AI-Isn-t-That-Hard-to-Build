import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

import { main as search } from './search'
import cors from '@elysiajs/cors'

// Server configuration
const PORT = process.env.PORT || 9009

new Elysia({ adapter: node() })
    // Search endpoint: GET /search?q=<search term>
    // Returns an array of anime matches based on vector similarity
    .get('/search', async (req) => {
        const input = req.query.q as string

        // Perform vector similarity search and return matches
        const result = await search(input) as any[]
				return result
    })

		// Enable CORS
		.use(cors())

    // Start the server and listen for incoming requests
    .listen(PORT, ({ hostname, port }) => {
        console.log(
            `🦊 Elysia is running at ${hostname}:${port}`
        )
    })