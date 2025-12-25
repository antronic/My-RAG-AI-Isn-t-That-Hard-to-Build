import { config } from 'dotenv'
import { consumer } from '../config/kafka'
import * as EmbededSave from '../tasks/embeded-save'
import { connectDB } from '../config/mongo'

config()

async function main() {
  // Connect to MongoDB
  await connectDB()
  // Define consumer ID
  const gId = process.argv[2] || 1
  // Create Kafka consumer with the specified group ID
  const c = consumer(`${gId}`)
  console.log('Starting consumer id...', gId)
  await c.connect()

  // Start the embedding and saving task
  await EmbededSave.start(c, Number(gId) as 1 | 2)

  process.on('SIGINT', async () => {
    console.log('🔴 Disconnecting consumer...');
    await c.disconnect();
    process.exit(0);
  })
}

main()