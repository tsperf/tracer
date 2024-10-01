/* eslint-disable no-console */
import type { WebSocket } from 'ws'
import { WebSocketServer } from 'ws'

import type * as Messages from './messages'
import { receiveMessage } from './receiveMessage'

const wss = new WebSocketServer({ port: 3010 })

console.log('listening on 3010')

wss.on('connection', (ws) => {
  console.log('connected')
  ws.on('error', console.error)

  ws.on('message', (data) => {
    const str = data.toString()
    try {
      const arr = JSON.parse(str)
      if (Array.isArray(arr)) {
        const [id, parsed] = arr
        if (typeof id !== 'number') {
          console.log('invalid message')
          console.log(JSON.stringify(arr, null, 2))
          return
        }
        if (arr.length !== 2) {
          console.log('invalid message')
          console.log(JSON.stringify(arr, null, 2))
          sendError(ws, id, 'expected a single object payload')
          return
        }

        if (Array.isArray(parsed)) {
          sendError(ws, id, 'expected a single object payload')
          console.log('unhandled payload')
          for (const item of parsed) console.log(`\t ${item}`)
        }
        else if (typeof parsed === 'object') {
          receiveMessage(id, parsed, ws)
        }
      }
      else {
        console.log(`string payload ${JSON.stringify(arr, null, 2)}`)
      }
    }
    catch (_e) {
      console.log(`non message payload ${str}`)
    }
  })
})

export function init() {}

// let messageHandler = (message: any) => console.log(message);
// export function setMessageHandler(handler: (message: any) => void) {
//    messageHandler = handler;
// }

// export function emitMessage(message: any) {
//    globalSocket?.emit(message.message, message);
// }

/*
io.on('connection', (socket) => {
   globalSocket = socket; // dumb but good enough.  latest connection get's the vscode emits
   console.log('a user connected');
   messageHandler('init client');
   socket.on('message', (...args: any[]) => {
      receiveMessage(args, socket);
   });
   socket.on('ping', () => {
      console.log('pinged');
      socket.emit('pong');
   });
});

server.listen(3010, 'localhost', () => {
   console.log('server running at http://localhost:3010');
});

*/

export function sendResponse(
  ws: WebSocket,
  id: number,
  response: Messages.Message,
  complete = true,
) {
  ws.send(
    JSON.stringify([id, response, complete ? 'complete' : 'incomplete']),
  )
}

export function sendError(ws: WebSocket, id: number, errorMessage: string) {
  ws.send(JSON.stringify([id, 'error', errorMessage]))
}
