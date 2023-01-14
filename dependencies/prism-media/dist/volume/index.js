"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeTransformer = exports.VolumeTransformerType = void 0;
const stream_1 = require("stream");
var VolumeTransformerType;
(function (VolumeTransformerType) {
    VolumeTransformerType["S16LE"] = "s16le";
    VolumeTransformerType["S16BE"] = "s16be";
    VolumeTransformerType["S32LE"] = "s32le";
    VolumeTransformerType["S32BE"] = "s32be";
})(VolumeTransformerType = exports.VolumeTransformerType || (exports.VolumeTransformerType = {}));
class VolumeTransformer extends stream_1.Transform {
    constructor(config) {
        var _a;
        super(config);
        this.volume = (_a = config.volume) !== null && _a !== void 0 ? _a : 1;
        this.buffer = Buffer.allocUnsafe(0);
        switch (config.type) {
            case VolumeTransformerType.S16LE:
                this.readInt = (buffer, index) => buffer.readInt16LE(index);
                this.writeInt = (buffer, value, index) => buffer.writeInt16LE(value, index);
                break;
            case VolumeTransformerType.S16BE:
                this.readInt = (buffer, index) => buffer.readInt16BE(index);
                this.writeInt = (buffer, value, index) => buffer.writeInt16BE(value, index);
                break;
            case VolumeTransformerType.S32LE:
                this.readInt = (buffer, index) => buffer.readInt32LE(index);
                this.writeInt = (buffer, value, index) => buffer.writeInt32LE(value, index);
                break;
            case VolumeTransformerType.S32BE:
                this.readInt = (buffer, index) => buffer.readInt32BE(index);
                this.writeInt = (buffer, value, index) => buffer.writeInt32BE(value, index);
                break;
        }
        const bits = config.type === VolumeTransformerType.S16LE || config.type === VolumeTransformerType.S16BE ? 16 : 32;
        this.bytes = Math.floor(bits / 8);
        this.extrema = [-Math.pow(2, bits - 1), Math.pow(2, bits - 1) - 1];
    }
    readInt() {
        throw new Error('readInt is unimplemented');
    }
    writeInt() {
        throw new Error('writeInt is unimplemented');
    }
    clamp(value) {
        const [neg, pos] = this.extrema;
        return Math.min(pos, Math.max(neg, value));
    }
    _transform(newChunk, encoding, done) {
        // Act as passthrough for volume 1
        if (this.volume === 1) {
            this.push(newChunk);
            done();
            return;
        }
        const { bytes } = this;
        const chunk = Buffer.concat([this.buffer, newChunk]);
        const readableLength = Math.floor(chunk.length / bytes) * bytes;
        let i = 0;
        while (i < readableLength) {
            this.writeInt(chunk, this.clamp(this.readInt(chunk, i) * this.volume), i);
            i += bytes;
        }
        this.buffer = chunk.slice(readableLength);
        this.push(chunk.slice(0, readableLength));
        done();
    }
}
exports.VolumeTransformer = VolumeTransformer;
//# sourceMappingURL=index.js.map