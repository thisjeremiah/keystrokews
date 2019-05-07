"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var os = __importStar(require("os"));
var util_1 = require("util");
var fs_1 = require("fs");
var child_process_1 = require("child_process");
// @ts-ignore
var powershell_1 = __importDefault(require("powershell"));
var writeFileAsync = util_1.promisify(fs_1.writeFile);
var execFileAsync = util_1.promisify(child_process_1.execFile);
var raw = String.raw;
var ELEVATE = raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @echo off\n  if _%1_==_payload_  goto :payload\n\n  :getadmin\n      echo %~nx0: elevating self\n      set vbs=%temp%getadmin.vbs\n      echo Set UAC = CreateObject^(\"Shell.Application\"^)                >> \"%vbs%\"\n      echo UAC.ShellExecute \"%~s0\", \"payload %~sdp0 %*\", \"\", \"runas\", 1 >> \"%vbs%\"\n      \"%temp%getadmin.vbs\"\n      del \"%temp%getadmin.vbs\"\n  goto :eof\n\n  :payload\n"], ["\n  @echo off\n  if _%1_==_payload_  goto :payload\n\n  :getadmin\n      echo %~nx0: elevating self\n      set vbs=%temp%\\getadmin.vbs\n      echo Set UAC = CreateObject^(\"Shell.Application\"^)                >> \"%vbs%\"\n      echo UAC.ShellExecute \"%~s0\", \"payload %~sdp0 %*\", \"\", \"runas\", 1 >> \"%vbs%\"\n      \"%temp%\\getadmin.vbs\"\n      del \"%temp%\\getadmin.vbs\"\n  goto :eof\n\n  :payload\n"])));
var execDir = path.dirname(process.execPath);
function sendKeyScript(key) {
    return raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    $wsh = New-Object -ComObject WScript.Shell;\n    $wsh.SendKeys('{", "}')"], ["\n    $wsh = New-Object -ComObject WScript.Shell;\n    $wsh.SendKeys('{", "}')"])), key);
}
exports.sendKeyScript = sendKeyScript;
function windowsSendKey_old(key) {
    return __awaiter(this, void 0, void 0, function () {
        var scriptPath, script, elevatedScript, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    scriptPath = os.tmpdir() + "/sendkey.cmd";
                    console.log('send key', key);
                    script = sendKeyScript(key);
                    elevatedScript = script // `${ELEVATE}\r\n${script}`
                    ;
                    return [4 /*yield*/, writeFileAsync(scriptPath, elevatedScript)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, execFileAsync(scriptPath)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.windowsSendKey_old = windowsSendKey_old;
function windowsSendKey(key) {
    return __awaiter(this, void 0, void 0, function () {
        var ps;
        return __generator(this, function (_a) {
            ps = new powershell_1.default(sendKeyScript(key));
            // Handle process errors (e.g. powershell not found)
            // @ts-ignore
            ps.on('error', function (err) {
                console.error(err);
            });
            // Stdout
            // @ts-ignore
            ps.on('output', function (data) {
                console.log(data);
            });
            // Stderr
            // @ts-ignore
            ps.on('error-output', function (data) {
                console.error(data);
            });
            // End
            // @ts-ignore
            ps.on('end', function (code) {
                // Do Something on end
            });
            return [2 /*return*/];
        });
    });
}
exports.windowsSendKey = windowsSendKey;
var templateObject_1, templateObject_2;