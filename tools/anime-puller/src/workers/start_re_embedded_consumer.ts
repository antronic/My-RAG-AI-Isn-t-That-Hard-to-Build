import { consumer } from '../config/kafka'
import { connectDB } from '../config/mongo'
import { getData, updateData } from '../tasks/manage_data'

const KAFKA_TOPIC = 'anime-re-embed-topic'

async function main() {
  const gId = process.argv[2] || 1
  const _consumer = consumer(`${gId}`)

  await _consumer.connect()

  await connectDB()

  console.log('Starting re-embedded consumer id...', gId)
  console.log('KAFKA_TOPIC', KAFKA_TOPIC)

  await _consumer.subscribe({
    topic: KAFKA_TOPIC,
    fromBeginning: true,
  })

  await _consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const task = JSON.parse(message.value!.toString());
      console.log(`✅ Task Received:`, task._id);
      console.log('topic', topic, 'partition', partition)

      const { _id, ...data } = task

      console.log(`Updating ${_id}...`)
      await updateData(_id, data)
    }
  })


  console.log('Done')
  process.on('SIGINT', async () => {
    console.log('🔴 Disconnecting consumer...');
    await _consumer.disconnect();
    process.exit(0);
  })
}

main()