import WebSocket from 'ws'
import { exec } from 'child_process'
import os from 'os'
import PowerShell from 'powershell'

const WEBSOCKET_MASTER = process.env.WEBSOCKET_MASTER || '127.0.0.1'
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 7379

const isWindows = os.type() === 'Windows_NT'

// TODO Reconnections to the WebSocket server
// TODO Completion guarantees
// TODO Status monitoring

const ws = new WebSocket(`ws://${WEBSOCKET_MASTER}:${WEBSOCKET_PORT}`)

console.log(
  `WebSocket Client listening on ws://${WEBSOCKET_MASTER}:${WEBSOCKET_PORT}`,
)

function keystroke(keyMessage: string) {
  const key = JSON.parse(keyMessage)

  if (!key.name) return

  console.log(key.name)

  if (isWindows) {
    windowsSendKey(key.name)
  } else {
    macSendKey(key.name)
  }
}

function macSendKey(key: string) {
  const script = `osascript -e 'tell application "System Events" to keystroke "${key}"'`
  exec(script, (err, message) => {
    if (err) console.error(err)
  })
}

function windowsSendKey(key: string) {
  const script = String.raw`
    $wsh = New-Object -ComObject WScript.Shell;
    $wsh.SendKeys('{${key}}')`
  const ps = new PowerShell(script)
  ps.on('error', err => console.error(err))
  ps.on('output', data => console.log(data))
  ps.on('error-output', data => console.error(data))
  ps.on('end', () => {})
}

ws.on('open', () => {})
ws.on('message', keystroke)
ws.on('error', err => {
  console.error(err.message)
})
