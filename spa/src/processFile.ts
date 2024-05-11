import { appState } from './appState'
import { traceData } from './traceData'

export function getFileDataHandler(fileName: string) {
  let handler: boolean | ((a: string, b: string) => void) = false
  if (fileName === 'trace.json')
    handler = handleTrace
  else if (fileName === 'types.json')
    handler = handleTypes

  const ret = handler
  return ret && ((text: string) => ret(fileName, text))
}

function handleTrace(fileName: string, text: string) {
  const data = validate(text)
  if (!data)
    return

  appState.traceFiles[fileName] = { name: fileName, data, type: 'type' }
}

function handleTypes(fileName: string, text: string) {
  const data = validate(text)
  if (!data)
    return

  let lastTs = data[0].ts
  for (let i = 0; i < data.length; i++) {
    data[i].dur = data[i].ts - lastTs
    lastTs = data[i].ts
  }

  appState.traceFiles[fileName] = { name: fileName, data, type: 'type' }
}

function validate(text: string) {
  const obj = JSON.parse(text)
  const parsed = traceData.safeParse(obj)
  if (parsed.error) {
    appState.error = JSON.stringify(parsed.error, null, 2)
    return false
  }
  else {
    return obj
  }
}
