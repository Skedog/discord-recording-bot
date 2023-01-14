"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OggLogicalBitstream = void 0;
const OggLogicalBitstream_1 = require("../ogg/OggLogicalBitstream");
const utils_1 = require("./utils");
/**
 * Transforms an object stream of Opus objects into a logical Ogg Opus stream that is compliant
 * with RFC7845 {@link https://tools.ietf.org/html/rfc7845}
 */
class OggLogicalBitstream extends OggLogicalBitstream_1.OggLogicalBitstream {
    constructor(options) {
        var _a;
        super(options);
        this.opusHead = options.opusHead;
        this.opusTags = (_a = options.opusTags) !== null && _a !== void 0 ? _a : new utils_1.OpusTags();
        this.writeHeaderPages([[options.opusHead.toBuffer()], [this.opusTags.toBuffer()]]);
    }
    calculateGranulePosition(packets) {
        const sampleRate = this.opusHead.sampleRate / 1000;
        const newCount = packets.reduce((acc, val) => acc + sampleRate * utils_1.FRAME_SIZE_MAP[val[0] >> 3], 0);
        return this.granulePosition + newCount;
    }
}
exports.OggLogicalBitstream = OggLogicalBitstream;
//# sourceMappingURL=OggLogicalBitstream.js.map