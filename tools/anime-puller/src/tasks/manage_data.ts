import { config } from 'dotenv'
import { db } from '../config/mongo'
// import { generateEmbedding } from '../services/ollama'
// import { generateEmbedding } from '../services/azure-openai'
import { ObjectId } from 'mongodb'
import { getEmbeddingContent } from '../config/prompt'
import { generateEmbedding, getModelName } from '../services/llm'

config()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getData(skip = 0, limit = 500) {
  console.log('🍀 Fetching...')
  console.log('🍀 Skip:', limit * skip, 'limit:', limit)
  const results = await db?.collection('raw_anime_list')
      // .find({ synopsis: { $exists: true }, synopsis_embedding: { $type: 'object' } })
      // .find({ synopsis: { $exists: true } })
      // .find({ model: { $exists: false }, synopsis: { $ne: null } })
      // .find({ synopsis: { $ne: null } })
      .find({ })
      // .project({ _id: 1, synopsis: 1 })
      .limit(limit)
      .skip(limit * skip)
      .toArray()

  console.log('🍀 Fetched:', results!.length)

  return results
  // return []
}

export async function updateData(_id: string, data: any) {
  let embedding: any = null
  try {
    console.log('🍀 Generating embedding...')
    embedding = await generateEmbedding(
      getEmbeddingContent(data)
    )
    console.log('🍀 Generated embedding!')


    // Save to MongoDB
    await db!.collection('embedded_aoai_anime_list')
      .updateOne({ _id: new ObjectId(_id) }, {
        $set: {
          ...data,
          synopsis_embedding: embedding,
          model: getModelName(),
        },
      },
    {
      upsert: true,
    })
    console.log('🍀 Updated!')
  } catch (error) {
    console.log('❌ Failed to parse data for', _id)
  }
}