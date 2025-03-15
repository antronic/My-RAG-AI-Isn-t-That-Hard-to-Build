import { Kafka } from "kafkajs";

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "bun-consumer",
  brokers: ["localhost:9092"], // Update with your Kafka broker
});

const consumer = kafka.consumer({ groupId: "bun-group" });

async function consumeMessages() {
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  console.log("🚀 Consumer started listening...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📩 Received message: ${message.value?.toString()} from ${topic}`);
    },
  });
}

consumeMessages().catch(console.error);