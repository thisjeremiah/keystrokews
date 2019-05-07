import { Server } from 'ws'
import { exec } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import express from 'express'

const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 7379
const HTTP_PORT = Number(process.env.HTTP_PORT) || 7777

function main() {
  startWebSocketServer()
  startHttpServer()
}

function startWebSocketServer() {
  const wss = new Server({
    port: WEBSOCKET_PORT,
  })

  function broadcast(message: string, sender?: any) {
    wss.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN && ws !== sender) {
        ws.send(message)
      }
    })
  }

  wss.on('connection', ws => {
    console.log('WebSocket client connected')

    ws.on('message', (message: string) => {
      try {
        broadcast(message, ws)
      } catch (err) {
        console.error(err)
      }
    })

    ws.on('close', () => console.log('WebSocket client closed'))

    ws.on('error', err => console.error(err))
  })
  wss.on('listening', () =>
    console.log(`WebSocket server listening on port ${WEBSOCKET_PORT}`),
  )
  wss.on('error', err => console.error(err))
}

function startHttpServer() {
  const app = express()

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
  })

  app.listen(HTTP_PORT)

  console.log(`HTTP server listening on port ${HTTP_PORT}`)
}

main()
