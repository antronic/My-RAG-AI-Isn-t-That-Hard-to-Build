import { config } from 'dotenv'
import { Db, MongoClient } from 'mongodb'
//
// Load environment variables from .env file
config()
//
// MongoDB connection pooling
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:56717'
const DB_NAME = process.env.MONGO_DB_NAME || 'my_gen_ai'


let client: MongoClient | null = null
let db: Db | null = null

async function connectDB() {
    console.log('🔌 Connecting to MongoDB...')
    console.log(MONGO_URI)
    if (!client) {
        client = new MongoClient(MONGO_URI, {
            minPoolSize: 5, // Minimum connections in pool
            maxPoolSize: 20, // Maximum connections in pool
            serverSelectionTimeoutMS: 5000, // Timeout for initial connection
            connectTimeoutMS: 10000, // Timeout for connection attempts
            directConnection: true,
        })

        await client.connect()
        console.log('✅ 🍃 MongoDB connected with connection pooling')
        db = client.db(DB_NAME)
    }
    return { client, db }
}

export { connectDB, db, client }