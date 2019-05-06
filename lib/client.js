"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var readline = __importStar(require("readline"));
var WEBSOCKET_PORT = 7379 || process.env.WEBSOCKET_PORT;
readline.emitKeypressEvents(process.stdin);
// @ts-ignore
process.stdin.setRawMode(true);
process.stdin.on('keypress', function (_, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
        return;
    }
    var ws = new ws_1.default("ws://localhost:" + WEBSOCKET_PORT);
    ws.on('open', function () {
        ws.send(JSON.stringify(key));
        ws.close();
    });
});
