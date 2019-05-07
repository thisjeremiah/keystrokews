"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT) || 7379;
var HTTP_PORT = Number(process.env.HTTP_PORT) || 7777;
function main() {
    startWebSocketServer();
    startHttpServer();
}
function startWebSocketServer() {
    var wss = new ws_1.Server({
        port: WEBSOCKET_PORT,
    });
    function broadcast(message, sender) {
        wss.clients.forEach(function (ws) {
            if (ws.readyState === ws.OPEN && ws !== sender) {
                ws.send(message);
            }
        });
    }
    wss.on('connection', function (ws) {
        console.log('WebSocket Client connected');
        ws.on('message', function (message) {
            try {
                broadcast(message, ws);
            }
            catch (err) {
                console.error(err);
            }
        });
        ws.on('close', function () { return console.log('WebSocket Client closed'); });
        ws.on('error', function (err) { return console.error(err); });
    });
    wss.on('listening', function () {
        return console.log("WebSocket Server listening on port " + WEBSOCKET_PORT);
    });
    wss.on('error', function (err) { return console.error(err); });
}
function startHttpServer() {
    var app = express_1.default();
    app.get('/', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, '/index.html'));
    });
    app.listen(HTTP_PORT);
    console.log("HTTP Server listening on port " + HTTP_PORT);
}
main();
