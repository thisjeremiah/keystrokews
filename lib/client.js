"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var child_process_1 = require("child_process");
var os_1 = __importDefault(require("os"));
var windowsScripts_1 = require("./windowsScripts");
var WEBSOCKET_MASTER = process.env.WEBSOCKET_MASTER || '1.1.1.1';
var WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 7379;
var ws = new ws_1.default("ws://" + WEBSOCKET_MASTER + ":" + WEBSOCKET_PORT);
var prevKeyName = '';
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
}
ws.on('open', function () { });
ws.on('message', function (message) {
    keystroke(message);
});
ws.on('error', function () { });
