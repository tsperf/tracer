/* eslint-disable no-console */
import { createServer } from 'node:http'
import { join } from 'node:path'
import express from 'express'
import { Server, type Socket } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

let globalSocket: Socket

// const __dirname = dirname(fileURLToPath(import.meta.url))
console.log({ __dirname })

let messageHandler = (message: any) => console.log(message)
export function setMessageHandler(handler: (message: any) => void) {
  messageHandler = handler
}

export function emitMessage(message: any) {
  globalSocket?.emit(message.message, message)
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'srcDev', 'public', 'index.html'))
})

app.get('/index.js', (req, res) => {
  res.sendFile(join(__dirname, '..', 'srcDev', 'dist', 'client', 'index.js'))
})

app.get('/index.js.map', (req, res) => {
  res.sendFile(join(__dirname, '..', 'srcDev', 'dist', 'client', 'index.js.map'))
})

io.on('connection', (socket) => {
  globalSocket = socket // dumb but good enough.  latest connection get's the vscode emits
  console.log('a user connected')
  socket.onAny((name, ...args: any[]) => {
    console.log('message from client', name, args)
    messageHandler({ ...args[0], message: name })
  })
  socket.on('ping', () => {
    console.log('pinged')
    socket.emit('pong')
  })
})

server.listen(3010, () => {
  console.log('server running at http://localhost:3010')
})
