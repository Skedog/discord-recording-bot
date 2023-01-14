"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordJSOpusEncoder = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const OpusEncoder_1 = require("./OpusEncoder");
class DiscordJSOpusEncoder extends OpusEncoder_1.OpusEncoder {
    constructor(options) {
        super(options);
        const { OpusEncoder } = require('@discordjs/opus');
        this.encoder = new OpusEncoder(options.rate, options.channels);
    }
    encode(buffer) {
        return this.encoder.encode(buffer);
    }
    decode(buffer) {
        return this.encoder.decode(buffer);
    }
    applyEncoderCTL(ctl, value) {
        this.encoder.applyEncoderCTL(ctl, value);
    }
    applyDecoderCTL(ctl, value) {
        this.encoder.applyDecoderCTL(ctl, value);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    delete() { }
}
exports.DiscordJSOpusEncoder = DiscordJSOpusEncoder;
//# sourceMappingURL=@discordjs-opus.js.map