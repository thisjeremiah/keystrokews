import { Server } from 'ws'
import { exec } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import express from 'express'
import { windowsSendKey } from './windowsScripts'

const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 7379
const HTTP_PORT = Number(process.env.HTTP_PORT) || 7777

const SERVER_CONNECTED = 'server.connected'
const SERVER_HEARTBEAT = 'server.heartbeat'
const SERVER_HEARTBEAT_RATE = 5000

let prevKeyName = ''

function startWebSocketServer() {
  console.log('Start Websocket Broadcast Server')

  const wss = new Server({
    port: WEBSOCKET_PORT,
  })

  function broadcast(s: string, wsSender?: any) {
    wss.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN && ws !== wsSender) {
        ws.send(s)
      }
    })
  }

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
    // TODO using {control down, shift down}'`,
  }

  wss.on('connection', ws => {
    console.log('WebSocket client connected')

    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          event: SERVER_CONNECTED,
        }),
      )
    }

    ws.on('message', (s: string) => {
      try {
        keystroke(s)
        broadcast(s, ws)
      } catch (err) {
        console.error(err)
      }
    })

    ws.on('close', () => console.log('Websocket client closed'))
    ws.on('error', err => console.error(err))
  })
  wss.on('listening', () =>
    console.log(
      `Websocket Broadcast Server listening on port ${WEBSOCKET_PORT}`,
    ),
  )
  wss.on('error', err => console.error(err))
}

function startHttpServer() {
  const app = express()

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
  })

  app.listen(HTTP_PORT)
}

function main() {
  startWebSocketServer()
  startHttpServer()
}

main()
