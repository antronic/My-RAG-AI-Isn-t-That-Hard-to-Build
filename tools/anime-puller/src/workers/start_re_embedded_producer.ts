import { producer } from '../config/kafka'
import { connectDB } from '../config/mongo'
import { getData } from '../tasks/manage_data'

const KAFKA_TOPIC = 'anime-re-embed-topic'

async function main(start: string, end: string) {
  await producer.connect()

  await connectDB()

  const createRoundRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start)
  }

  const rounds = createRoundRange(Number(start), Number(end))

  for (const round of rounds) {
    //
    console.log('Round:', round)
    // Get data
    const results = await getData(round)
    if (results) {
      for (const result of results) {
        const _id = result._id
        const synopsis = result.synopsis
        if (synopsis) {
          console.log(`Sending data for ${_id}...`)
          await producer.send({
            topic: KAFKA_TOPIC,
            messages: [
              {
                key: String(_id),
                value: JSON.stringify({ _id, synopsis }),
              }
            ]
          })
        }
      }
    }
  }


  console.log('Done')
}

const start = process.argv[2] || '1'
const end = process.argv[3] || '10'

main(start, end)