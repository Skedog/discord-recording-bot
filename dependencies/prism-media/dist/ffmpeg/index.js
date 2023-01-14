"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFFmpeg = exports.FFmpeg = void 0;
const duplex_child_process_1 = __importDefault(require("duplex-child-process"));
const loader_1 = require("./loader");
Object.defineProperty(exports, "findFFmpeg", { enumerable: true, get: function () { return loader_1.findFFmpeg; } });
class FFmpeg extends duplex_child_process_1.default {
    constructor(options) {
        super(options);
        this.spawn(loader_1.findFFmpeg(options.forceRefresh).command, [...options.args, 'pipe:1'], {
            shell: true,
            windowsHide: true,
            ...options,
        });
    }
}
exports.FFmpeg = FFmpeg;
//# sourceMappingURL=index.js.map