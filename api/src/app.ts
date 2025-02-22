
import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import connectDB from './config/db'

config()

const app = express()
const PORT = process.env.PORT || 9009

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

connectDB()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})