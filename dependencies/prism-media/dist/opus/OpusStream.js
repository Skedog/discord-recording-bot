"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpusStream = exports.OpusCTL = exports.OpusApplication = void 0;
const stream_1 = require("stream");
const loader_1 = require("./loader");
var OpusApplication;
(function (OpusApplication) {
    OpusApplication[OpusApplication["VoIP"] = 2048] = "VoIP";
    OpusApplication[OpusApplication["Audio"] = 2049] = "Audio";
    OpusApplication[OpusApplication["RestrictedLowDelay"] = 2051] = "RestrictedLowDelay";
})(OpusApplication = exports.OpusApplication || (exports.OpusApplication = {}));
var OpusCTL;
(function (OpusCTL) {
    OpusCTL[OpusCTL["SetBitrate"] = 4002] = "SetBitrate";
    OpusCTL[OpusCTL["SetFEC"] = 4012] = "SetFEC";
    OpusCTL[OpusCTL["SetPLP"] = 4014] = "SetPLP";
})(OpusCTL = exports.OpusCTL || (exports.OpusCTL = {}));
class OpusStream extends stream_1.Transform {
    constructor(config) {
        super(config.streamOptions);
        this.encoder = loader_1.createOpusEncoder({
            channels: config.channels,
            frameSize: config.frameSize,
            rate: config.rate,
        });
        // *2 because each sample is 2 bytes
        this.pcmLength = config.frameSize * config.channels * 2;
    }
    encode(buffer) {
        return this.encoder.encode(buffer);
    }
    decode(buffer) {
        return this.encoder.decode(buffer);
    }
    _destroy(error, callback) {
        this.cleanup();
        callback(error);
    }
    _final(callback) {
        this.cleanup();
        callback();
    }
    setBitrate(bitrate) {
        return this.applyCTL(OpusCTL.SetBitrate, bitrate);
    }
    setFEC(enabled) {
        return this.applyCTL(OpusCTL.SetFEC, enabled ? 1 : 0);
    }
    setPLP(percentage) {
        return this.applyCTL(OpusCTL.SetPLP, Math.min(100, Math.max(0, percentage * 100)));
    }
    cleanup() {
        this.encoder.delete();
    }
}
exports.OpusStream = OpusStream;
//# sourceMappingURL=OpusStream.js.map