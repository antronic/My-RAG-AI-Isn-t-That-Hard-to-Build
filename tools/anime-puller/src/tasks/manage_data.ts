import { config } from 'dotenv'
import { db } from '../config/mongo'
// import { generateEmbedding } from '../services/ollama'
import { generateEmbedding } from '../services/azure-openai'
import { ObjectId } from 'mongodb'

config()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getData(skip = 0, limit = 100) {
  console.log('🍀 Fetching...')
  console.log('🍀 Skip:', limit * skip, 'limit:', limit)
  const results = await db?.collection('embedded_aoai_anime_list')
      // .find({ synopsis: { $exists: true }, synopsis_embedding: { $type: 'object' } })
      // .find({ synopsis: { $exists: true } })
      .find({ model: { $exists: false }, synopsis: { $ne: null } })
      // .project({ _id: 1, synopsis: 1 })
      // .limit(limit)
      // .skip(limit * skip)
      .toArray()

  console.log('🍀 Fetched:', results!.length)

  // return results
  return []
}

export async function updateData(_id: string, data: any) {
  const embedding = await generateEmbedding(JSON.stringify(data))

  await db?.collection('embedded_aoai_anime_list')
    .updateOne({ _id: new ObjectId(_id) }, {
      $set: {
        synopsis_embedding: embedding.data[0].embedding,
        model: 'openai_gpt-ada-002',
      },
      $unset: { embedding: '' },
    })
  console.log('🍀 Updated!')
}