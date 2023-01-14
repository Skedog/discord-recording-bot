"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFFmpeg = void 0;
const child_process_1 = require("child_process");
let cached;
const VERSION_REGEX = /version (.+) Copyright/im;
const SOURCES = [
    () => {
        var _a;
        const ffmpeg = require('ffmpeg-static');
        return (_a = ffmpeg === null || ffmpeg === void 0 ? void 0 : ffmpeg.path) !== null && _a !== void 0 ? _a : ffmpeg;
    },
    () => 'ffmpeg',
    () => 'avconv',
    () => './ffmpeg',
    () => './avconv',
];
function findFFmpeg(forceRefresh = false) {
    var _a;
    if (!forceRefresh && cached) {
        return cached;
    }
    const errorLog = [];
    for (const fn of SOURCES) {
        try {
            const command = fn();
            const result = child_process_1.spawnSync(command, ['-h'], { windowsHide: true, shell: true, encoding: 'utf-8' });
            if (result.error)
                throw result.error;
            if (result.stderr && !result.stdout)
                throw new Error(result.stderr);
            const output = result.output.filter(Boolean).join('\n');
            const version = (_a = VERSION_REGEX.exec(output)) === null || _a === void 0 ? void 0 : _a[1];
            if (!version)
                throw new Error(`Malformed FFmpeg command using ${command}`);
            cached = { command, output, version };
            return cached;
        }
        catch (error) {
            errorLog.push(`- Load failure:\n  ${error instanceof Error ? error.message : 'unknown'}`);
        }
    }
    throw new Error(`Could not find FFmpeg/avconv:\n${errorLog.join('\n')}`);
}
exports.findFFmpeg = findFFmpeg;
//# sourceMappingURL=loader.js.map