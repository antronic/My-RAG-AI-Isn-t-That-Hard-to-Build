import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      maxPoolSize: 10, // Utilize connection pooling
    })
    console.log('MongoDB Connected with connection pool')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

export default connectDB