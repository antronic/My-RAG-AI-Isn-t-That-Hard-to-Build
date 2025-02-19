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

      const { images, url, producers, ...data  } = task
      const embeddedData = await generateEmbedding(JSON.stringify(data))

      await db?.collection('anime_list')
        .insertOne({
          ...task,
          embedding: embeddedData.embedding,
        }).catch(console.error)

      console.log('🍀 Write success')
    },
  })
}