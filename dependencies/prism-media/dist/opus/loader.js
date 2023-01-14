"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpusEncoder = exports.loadOpusLibrary = void 0;
const _discordjs_opus_1 = require("./adapters/@discordjs-opus");
const opusscript_1 = require("./adapters/opusscript");
const LOADERS = [
    ['@discordjs/opus', (options) => new _discordjs_opus_1.DiscordJSOpusEncoder(options)],
    ['opusscript', (options) => new opusscript_1.OpusScriptEncoder(options)],
];
let cached;
function loadOpusLibrary(extraLoaders = [], forceRefresh = false) {
    var _a, _b;
    if (!forceRefresh && cached) {
        return cached;
    }
    const errorLog = [];
    for (const [modName, fn] of extraLoaders.concat(LOADERS)) {
        try {
            require(modName);
            return (cached = fn);
        }
        catch (error) {
            errorLog.push(`- Load failure ${modName}:\n  ${(_b = (_a = error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : 'unknown'}`);
        }
    }
    throw new Error(`Could not find an Opus engine:\n${errorLog.join('\n')}`);
}
exports.loadOpusLibrary = loadOpusLibrary;
function createOpusEncoder(options, extraLoaders, forceRefresh) {
    return loadOpusLibrary(extraLoaders, forceRefresh)(options);
}
exports.createOpusEncoder = createOpusEncoder;
//# sourceMappingURL=loader.js.map