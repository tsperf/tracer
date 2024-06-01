import { commands } from './commands.js'

const iframe = document.getElementById('dev')
// equivalence relation allows extra keys in b
function deepEq(a, b) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.some(key => !bKeys.includes(key)))
    return false
  for (const key in a) {
    const va = a[key]
    const vb = b[key]
    if (typeof va !== typeof vb || !!va !== !!vb)
      return false
    if (typeof va === 'object' && !deepEq(va, vb))
      return false
    if (!(va === vb))
      return false
  }
  return true
}
function handleMessage(e) {
  if (!e || !(typeof e === 'object'))
    return
  for (const message of commands) {
    if (message.trigger && deepEq(message.trigger, e.data))
      iframe.contentWindow?.postMessage(message.response, '*')
  }
}
window.addEventListener('message', handleMessage)
// @ts-expect-error window shenanigans
window.testMessage = () => {
  iframe.contentWindow?.postMessage({ message: 'pong' }, '*')
}
let widgetHtml = ''
const commandResponses = {}
for (const command of commands) {
  if ('trigger' in command
    && command.trigger
    && 'command' in command.trigger
    && command.trigger.command) {
    commandResponses[command.trigger.command] ??= []
    commandResponses[command.trigger.command].push(command.response)
  }
}
for (const key in commandResponses)
  widgetHtml += `<button id="${key}">${key}</button>`
const div = document.createElement('div')
div.style.cssText
    = 'background-color:rgb(255,255,255,.3); color:wheat; display: none; position: absolute; top:20vh; left:20vw; border: 1px solid green'
div.innerHTML = widgetHtml
document.body.prepend(div)
let displayModal = 'none'
const devBtn = document.getElementById('devBtn')
devBtn.addEventListener('click', () => {
  displayModal = displayModal === 'none' ? 'block' : 'none'
  div.style.display = displayModal
})
for (const child of div.children) {
  child.addEventListener('click', () => {
    const responses = [...(commandResponses[child.id] ?? [])]
    const interval = setInterval(() => {
      const response = responses.shift()
      if (response) {
        // eslint-disable-next-line no-console
        console.log(response)
        iframe.contentWindow?.postMessage(response, '*')
      }
      else {
        clearInterval(interval)
      }
    }, 1000)
  })
}
