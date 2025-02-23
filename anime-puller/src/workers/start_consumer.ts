import { config } from 'dotenv'
import { consumer } from '../config/kafka'
import * as EmbededSave from '../tasks/embeded-save'
import { connectDB } from '../config/mongo'

config()

async function main() {



  await connectDB()
  const gId = process.argv[2] || 1
  const c = consumer(`${gId}`)

  console.log('Starting consumer id...', gId)
  await c.connect()
  await EmbededSave.start(c)

  process.on('SIGINT', async () => {
    console.log('🔴 Disconnecting consumer...');
    await c.disconnect();
    process.exit(0);
  })
}

main()