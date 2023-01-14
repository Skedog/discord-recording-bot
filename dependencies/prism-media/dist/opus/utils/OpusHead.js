"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpusHead = void 0;
const OPUSHEAD = Buffer.from('OpusHead');
class OpusHead {
    constructor(data) {
        var _a, _b;
        this.channelCount = data.channelCount;
        this.sampleRate = data.sampleRate;
        this.preskip = (_a = data.preskip) !== null && _a !== void 0 ? _a : data.sampleRate * (80 / 1000); // 80ms of samples is a good default
        this.outputGain = (_b = data.outputGain) !== null && _b !== void 0 ? _b : 0;
    }
    toBuffer() {
        const head = Buffer.alloc(19);
        OPUSHEAD.copy(head, 0, 0);
        head[8] = 1;
        head[9] = this.channelCount;
        head.writeUInt16LE(this.preskip, 10);
        head.writeUInt32LE(this.sampleRate, 12);
        head.writeUInt16LE(this.outputGain, 16);
        head[18] = 0;
        return head;
    }
}
exports.OpusHead = OpusHead;
//# sourceMappingURL=OpusHead.js.map