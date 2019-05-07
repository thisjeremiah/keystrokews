"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var child_process_1 = require("child_process");
var os_1 = __importDefault(require("os"));
var powershell_1 = __importDefault(require("powershell"));
var WEBSOCKET_MASTER = process.env.WEBSOCKET_MASTER || '127.0.0.1';
var WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 7379;
var isWindows = os_1.default.type() === 'Windows_NT';
// TODO Reconnections to the WebSocket server
// TODO Completion guarantees
// TODO Status monitoring
var ws = new ws_1.default("ws://" + WEBSOCKET_MASTER + ":" + WEBSOCKET_PORT);
console.log("WebSocket Client listening on ws://" + WEBSOCKET_MASTER + ":" + WEBSOCKET_PORT);
function keystroke(keyMessage) {
    var key = JSON.parse(keyMessage);
    if (!key.name)
        return;
    console.log('keystroke ', key.name);
    if (isWindows) {
        windowsSendKey(key.name);
    }
    else {
        macSendKey(key.name);
    }
}
function macSendKey(key) {
    var script = "osascript -e 'tell application \"System Events\" to keystroke \"" + key + "\"'";
    child_process_1.exec(script, function (err, message) {
        if (err)
            console.error(err);
    });
}
function windowsSendKey(key) {
    var script = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    $wsh = New-Object -ComObject WScript.Shell;\n    $wsh.SendKeys('{", "}')"], ["\n    $wsh = New-Object -ComObject WScript.Shell;\n    $wsh.SendKeys('{", "}')"])), key);
    var ps = new powershell_1.default(script);
    ps.on('error', function (err) { return console.error(err); });
    ps.on('output', function (data) { return console.log(data); });
    ps.on('error-output', function (data) { return console.error(data); });
    ps.on('end', function () { });
}
ws.on('open', function () { });
ws.on('message', keystroke);
ws.on('error', function (err) {
    console.error(err.message);
});
var templateObject_1;
