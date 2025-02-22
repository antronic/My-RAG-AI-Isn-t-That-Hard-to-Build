import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

import { main as search } from './search'

const PORT = process.env.PORT || 9009

new Elysia({ adapter: node() })
	.get('/search', async (req) => {
    const input = req.query.q as string

    return await search(input) as any[]
  })
	.listen(PORT, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})