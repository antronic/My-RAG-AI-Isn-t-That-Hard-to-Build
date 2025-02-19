import { config } from 'dotenv'
import { Kafka } from 'kafkajs'
config()

const BROKER_URL = process.env.BROKER_URL || 'localhost:9092'

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [BROKER_URL]
})

// Producer
const producer = kafka.producer()

// Consumer
const consumer = (gId = '1') => kafka.consumer({
  groupId: 'anime-convertor-group-' + gId,
  sessionTimeout: 6000,
  rebalanceTimeout: 10000,
})

export { producer, consumer }