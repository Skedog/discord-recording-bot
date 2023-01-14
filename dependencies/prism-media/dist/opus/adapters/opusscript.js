"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpusScriptEncoder = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const OpusEncoder_1 = require("./OpusEncoder");
class OpusScriptEncoder extends OpusEncoder_1.OpusEncoder {
    constructor(options) {
        super(options);
        const OpusEncoder = require('opusscript');
        this.encoder = new OpusEncoder(options.rate, options.channels);
    }
    encode(buffer) {
        return this.encoder.encode(buffer, this.options.frameSize);
    }
    decode(buffer) {
        return this.encoder.decode(buffer);
    }
    applyEncoderCTL(ctl, value) {
        this.encoder.encoderCTL(ctl, value);
    }
    applyDecoderCTL(ctl, value) {
        this.encoder.decoderCTL(ctl, value);
    }
    delete() {
        this.encoder.delete();
    }
}
exports.OpusScriptEncoder = OpusScriptEncoder;
//# sourceMappingURL=opusscript.js.map