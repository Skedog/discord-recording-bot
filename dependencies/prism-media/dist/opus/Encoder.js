"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoder = void 0;
const OpusStream_1 = require("./OpusStream");
class Encoder extends OpusStream_1.OpusStream {
    constructor(options) {
        super({
            ...options,
            streamOptions: {
                ...options.streamOptions,
                readableObjectMode: true,
            },
        });
        this.buffer = Buffer.allocUnsafe(0);
    }
    _transform(newChunk, encoding, done) {
        const chunk = Buffer.concat([this.buffer, newChunk]);
        let i = 0;
        while (chunk.length >= i + this.pcmLength) {
            const pcm = chunk.slice(i, i + this.pcmLength);
            let opus;
            try {
                opus = this.encoder.encode(pcm);
            }
            catch (error) {
                done(error);
                return;
            }
            this.push(opus);
            i += this.pcmLength;
        }
        if (i > 0)
            this.buffer = chunk.slice(i);
        done();
    }
    applyCTL(ctl, value) {
        this.encoder.applyEncoderCTL(ctl, value);
    }
}
exports.Encoder = Encoder;
//# sourceMappingURL=Encoder.js.map