import { Consumer } from 'kafkajs'

import { db } from '../config/mongo'
import { generateEmbedding, getCollectionName, getModelName } from '../services/llm'

const TEXT_EMBEDDING_AI = process.env.TEXT_EMBEDDING_AI

export async function start(consumer: Consumer, taskType: 1 | 2 = 1) {
  await consumer.subscribe({
    topic: 'anime-task-topic',
    fromBeginning: true,
  })

  console.log('subscribing...')

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const task = JSON.parse(message.value!.toString());
      console.log(`✅ Task Received:`, task.title);
      console.log('topic', topic)

      const { images, url, producers, synopsis  } = task

      const tasks: Promise<any>[] = []

      // Insert into MongoDB based on task type
      if (taskType === 1) {
        let embeddedData = await generateEmbedding(JSON.stringify(synopsis))
        let modelName = getModelName()

        await db!.collection(getCollectionName())
        .insertOne({
          ...task,
          synopsis_embedding: embeddedData,
          model: modelName,
        })
      }

      // For task type 2, save raw data without embedding
      if (taskType === 2) {
        await db!.collection('raw_anime_list')
          .insertOne({
            ...task,
          })
      }


      console.log('🍀 Write success')
    },
  })
}