import { io } from 'socket.io-client'

export const socket = io({ port: 3010, host: 'localhost' })

// const devBtn = document.getElementById('devBtn') as HTMLButtonElement

const iframe = document.getElementById('dev') as HTMLIFrameElement

socket.onAny((name: string, ...args: any[]) => {
  const message = { ...(args[0] as object), message: name }
  iframe.contentWindow?.postMessage(message,'*')
})

window.addEventListener('message', (e) => {
  socket.emit(e.data.message, e.data)
})
