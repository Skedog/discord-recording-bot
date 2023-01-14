"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = void 0;
const OpusStream_1 = require("./OpusStream");
const OPUS_HEAD = Buffer.from('OpusHead');
const OPUS_TAGS = Buffer.from('OpusTags');
class Decoder extends OpusStream_1.OpusStream {
    constructor(options) {
        super({
            ...options,
            streamOptions: {
                ...options.streamOptions,
                writableObjectMode: true,
                readableObjectMode: true,
            },
        });
    }
    _transform(chunk, encoding, done) {
        if (chunk.length >= 8 && chunk.compare(OPUS_HEAD, 0, 8, 0, 8) === 0) {
            this.opusHead = chunk;
            this.emit('opusHead', chunk);
        } else if (chunk.length >= 8 && chunk.compare(OPUS_TAGS, 0, 8, 0, 8) === 0) {
            this.opusTags = chunk;
            this.emit('opusTags', chunk);
        }
        else {
            let frame;
            try {
                frame = this.encoder.decode(chunk);
            }
            catch (error) {
                done(error);
                return;
            }
            this.push(frame);
        }
        done();
    }
    applyCTL(ctl, value) {
        this.encoder.applyDecoderCTL(ctl, value);
    }
}
exports.Decoder = Decoder;
//# sourceMappingURL=Decoder.js.map