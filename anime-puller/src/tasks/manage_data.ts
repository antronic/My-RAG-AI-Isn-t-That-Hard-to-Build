import { config } from 'dotenv'
import { client, connectDB, db } from '../config/mongo'
import { generateEmbedding } from '../services/ollama'
import { ObjectId } from 'mongodb'

config()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getData(skip = 0, limit = 100) {
  const results = await db?.collection('anime_list')
      .find({ synopsis: { $exists: true }, synopsis_embedding: { $type: 'object' } })
      .project({ _id: 1, synopsis: 1 })
      .limit(limit)
      .skip(limit * skip)
      .toArray()

  return results
}

export async function updateData(_id: string, data: any) {
  const embedding = await generateEmbedding(JSON.stringify(data))

  await db?.collection('anime_list')
    .updateOne({ _id: new ObjectId(_id) }, {
      $set: {
        synopsis_embedding: embedding.embedding,
      },
      $unset: { embedding: '' },
    })
  console.log('🍀 Updated!')
}