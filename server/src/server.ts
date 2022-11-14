import express, { Express } from 'express'
import path from 'path'
import cors from 'cors'
import './server/environment'
import { apiRouter } from './api'
import { BUILD_DIR } from './utils/constants'
import connect from './database/connection/KnexConnection'
import { authentication, cookieParser } from './server/express'
// Establish connection and sync to db
// In production, we should also add the host:port of the FE service.
// For now, the server hadnles its own FE. but if we split to microservices or to different platforms,
// This will bneed to be revisited.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']

export const app: Express = express()
const port = process.env.PORT || 3000
app.use(cors({ credentials: true, origin: allowedOrigins }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser)
app.use(authentication)

// serve static
app.use(express.static(path.resolve(__dirname, BUILD_DIR)))
// serve api
app.use('/api', apiRouter)

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, BUILD_DIR, 'index.html'))
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Team Automate listening at http://localhost:${port}`)
  })
}

export const knex = connect()
