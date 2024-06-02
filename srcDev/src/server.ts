/* eslint-disable no-console */
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

// const __dirname = dirname(fileURLToPath(import.meta.url))
console.log({ __dirname })

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', '..', 'public', 'index.html'))
})

app.get('/index.js', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'index.js'))
})

app.get('/index.js.map', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'index.js.map'))
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('ping', () => {
    console.log('pinged')
    socket.emit('pong')
  })
})

server.listen(3010, () => {
  console.log('server running at http://localhost:3010')
})
