import { io } from 'socket.io-client'

export const socket = io({ port: 3010, host: 'localhost' })

export function ping() {
  socket.emit('ping')
  // eslint-disable-next-line no-alert
  socket.on('pong', () => alert('pong'))
}

const devBtn = document.getElementById('devBtn') as HTMLButtonElement

devBtn.onclick = ping
