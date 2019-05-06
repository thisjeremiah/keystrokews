import WebSocket from 'ws'
import { exec } from 'child_process'
import os from 'os'
import { windowsSendKey } from './windowsScripts'

const WEBSOCKET_MASTER = '1.1.1.1' || process.env.WEBSOCKET_MASTER
const WEBSOCKET_PORT = 7379 || process.env.WEBSOCKET_PORT

const ws = new WebSocket(`ws://${WEBSOCKET_MASTER}:${WEBSOCKET_PORT}`)

let prevKeyName = ''
function keystroke(keyJSON: string) {
  const key = JSON.parse(keyJSON)

  if (key.name === prevKeyName) return // no repeat

  prevKeyName = key.name
  // get rid of cached prevKeyName after 1 second
  setTimeout(() => {
    prevKeyName = ''
  }, 1000)

  const isWindows = os.type() === 'Windows_NT'

  if (isWindows) {
    windowsSendKey(key.name)
  } else {
    exec(macosKeyCommand(key.name), (err, message) => {
      if (err) console.error(err)
      console.log('keypress', key.name)
    })
  }
}

function macosKeyCommand(key: string) {
  return `osascript -e 'tell application "System Events" to keystroke "${key}"'`
}

ws.on('open', () => {})
ws.on('message', (message: string) => {
  keystroke(message)
})
ws.on('error', () => {})
