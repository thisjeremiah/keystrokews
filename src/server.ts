import { Server } from 'ws'
import { exec } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import express from 'express'

const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 7379
const HTTP_PORT = Number(process.env.HTTP_PORT) || 7777

function startWebSocketServer() {
  console.log('Start WebSocket Server')

  const wss = new Server({
    port: WEBSOCKET_PORT,
  })

  function broadcast(message: string, wsSender?: any) {
    wss.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN && ws !== wsSender) {
        ws.send(message)
      }
    })
  }

  wss.on('connection', ws => {
    console.log('WebSocket Client connected')

    ws.on('message', (message: string) => {
      try {
        broadcast(message, ws)
      } catch (err) {
        console.error(err)
      }
    })

    ws.on('close', () => console.log('WebSocket Client closed'))
    ws.on('error', err => console.error(err))
  })
  wss.on('listening', () =>
    console.log(`WebSocket Server listening on port ${WEBSOCKET_PORT}`),
  )
  wss.on('error', err => console.error(err))
}

function startHttpServer() {
  const app = express()

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
  })

  app.listen(HTTP_PORT)

  console.log(`HTTP Server listening on port ${HTTP_PORT}`)
}

function main() {
  startWebSocketServer()
  startHttpServer()
}

main()
