"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var child_process_1 = require("child_process");
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var windowsScripts_1 = require("./windowsScripts");
var WEBSOCKET_PORT = 7379 || process.env.WEBSOCKET_PORT;
var HTTP_PORT = 7777 || process.env.HTTP_PORT;
var SERVER_CONNECTED = 'server.connected';
var SERVER_HEARTBEAT = 'server.heartbeat';
var SERVER_HEARTBEAT_RATE = 5000;
var prevKeyName = '';
function startWebSocketServer() {
    console.log('Start Websocket Broadcast Server');
    var wss = new ws_1.Server({
        port: WEBSOCKET_PORT,
    });
    function broadcast(s, wsSender) {
        wss.clients.forEach(function (ws) {
            if (ws.readyState === ws.OPEN && ws !== wsSender) {
                ws.send(s);
            }
        });
    }
    function keystroke(keyJSON) {
        var key = JSON.parse(keyJSON);
        if (key.name === prevKeyName)
            return; // no repeat
        prevKeyName = key.name;
        // get rid of cached prevKeyName after 1 second
        setTimeout(function () {
            prevKeyName = '';
        }, 1000);
        var isWindows = os_1.default.type() === 'Windows_NT';
        if (isWindows) {
            windowsScripts_1.windowsSendKey(key.name);
        }
        else {
            child_process_1.exec(macosKeyCommand(key.name), function (err, message) {
                if (err)
                    console.error(err);
                console.log('keypress', key.name);
            });
        }
    }
    function macosKeyCommand(key) {
        return "osascript -e 'tell application \"System Events\" to keystroke \"" + key + "\"'";
        // TODO using {control down, shift down}'`,
    }
    wss.on('connection', function (ws) {
        console.log('WebSocket client connected');
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                event: SERVER_CONNECTED,
            }));
        }
        ws.on('message', function (s) {
            try {
                keystroke(s);
                broadcast(s, ws);
            }
            catch (err) {
                console.error(err);
            }
        });
        ws.on('close', function () { return console.log('Websocket client closed'); });
        ws.on('error', function (err) { return console.error(err); });
    });
    wss.on('listening', function () {
        return console.log("Websocket Broadcast Server listening on port " + WEBSOCKET_PORT);
    });
    wss.on('error', function (err) { return console.error(err); });
}
function startHttpServer() {
    var app = express_1.default();
    app.get('/', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, '/index.html'));
    });
    app.listen(HTTP_PORT);
}
function main() {
    startWebSocketServer();
    startHttpServer();
}
main();
