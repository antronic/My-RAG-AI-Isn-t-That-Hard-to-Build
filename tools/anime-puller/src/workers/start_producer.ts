import { config } from 'dotenv'
import { producer } from '../config/kafka'
import * as GetAnime from '../tasks/get-anime'

config()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(start = 1, end = 28176) {
  const createRoundRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start)
  }

  const rounds = createRoundRange(start, end)

  // console.log(createRoundRange(start, end))

  await producer.connect()
  for (const round of rounds) {
    console.log('Round:', round)
    await GetAnime.start(round)
    await sleep(2000)
  }
  await producer.disconnect()
}

const start = parseInt(process.argv[2]) || 1
const end = parseInt(process.argv[3]) || 1410
main(start, end)