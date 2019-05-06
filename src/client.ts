import WebSocket from 'ws'
import * as readline from 'readline'

const WEBSOCKET_PORT = 7379 || process.env.WEBSOCKET_PORT

readline.emitKeypressEvents(process.stdin)
// @ts-ignore
process.stdin.setRawMode(true)

process.stdin.on('keypress', (_, key) => {
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause()
    return
  }

  const ws = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`)

  ws.on('open', () => {
    ws.send(JSON.stringify(key))
    ws.close()
  })
})
