import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import client from './config/dbConfig'
import routes from './routes'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

client
  .connect()
  .then(() => {
    console.log('[database]: Connected to PostgreSQL database')
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database:', err)
  })

// Routes
app.use('/', routes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
