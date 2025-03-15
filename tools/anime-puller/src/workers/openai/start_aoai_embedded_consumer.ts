import { consumer } from '../../config/kafka'
import { connectDB } from '../../config/mongo'
import { getData, updateData } from '../../tasks/manage_data'

const KAFKA_TOPIC = 'anime-re-embed-topic'

async function main() {
  const gId = process.argv[2] || 1
  const _consumer = consumer(`${gId}`)

  await _consumer.connect()

  await connectDB()

  await _consumer.subscribe({
    topic: KAFKA_TOPIC,
    fromBeginning: true,
  })

  await _consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const task = JSON.parse(message.value!.toString());
      console.log(`✅ Task Received:`, task._id);
      console.log('topic', topic)

      const { _id, synopsis } = task

      console.log(`Updating ${_id}...`)
      await updateData(_id, synopsis)
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