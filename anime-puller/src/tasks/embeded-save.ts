import { Consumer } from 'kafkajs'
import { consumer } from '../config/kafka'
import { connectDB, db } from '../config/mongo'
import { generateEmbedding } from '../services/ollama'

export async function start(consumer: Consumer) {
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
      const embeddedData = await generateEmbedding(JSON.stringify(synopsis))

      await db?.collection('anime_list')
        .insertOne({
          ...task,
          synopsis_embedding: embeddedData.embedding,
        }).catch(console.error)

      console.log('🍀 Write success')
    },
  })
}