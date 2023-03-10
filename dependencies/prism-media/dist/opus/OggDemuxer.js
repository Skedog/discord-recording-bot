"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OggDemuxer = void 0;
const stream_1 = require("stream");
const OGG_PAGE_HEADER_SIZE = 26;
const STREAM_STRUCTURE_VERSION = 0;
const OGGS_HEADER = Buffer.from('OggS');
const OPUS_HEAD = Buffer.from('OpusHead');
const OPUS_TAGS = Buffer.from('OpusTags');
class OggDemuxer extends stream_1.Transform {
    constructor(options) {
        super({ ...options, readableObjectMode: true });
    }
    _transform(chunk, encoding, done) {
        if (this._remainder) {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = undefined;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const result = this._readPage(chunk);
            if (result) {
                const [error, buffer] = result;
                if (error) {
                    return done(error);
                }
                chunk = buffer;
            }
            else
                break;
        }
        this._remainder = chunk;
        done();
    }
    _readPage(chunk) {
        if (chunk.length < OGG_PAGE_HEADER_SIZE) {
            return false;
        }
        if (chunk.compare(OGGS_HEADER, 0, 4, 0, 4) !== 0) {
            return [new Error(`capture_pattern is not OGGS_HEADER`)];
        }
        if (chunk.readUInt8(4) !== STREAM_STRUCTURE_VERSION) {
            return [new Error(`stream_structure_version is not ${STREAM_STRUCTURE_VERSION}`)];
        }
        if (chunk.length < 27)
            return false;
        const pageSegments = chunk.readUInt8(26);
        if (chunk.length < 27 + pageSegments)
            return false;
        const table = chunk.slice(27, 27 + pageSegments);
        const bitstream = chunk.readUInt32BE(14);
        const sizes = [];
        let totalSize = 0;
        for (let i = 0; i < pageSegments;) {
            let size = 0;
            let x = 255;
            while (x === 255) {
                if (i >= table.length)
                    return false;
                x = table.readUInt8(i);
                i++;
                size += x;
            }
            sizes.push(size);
            totalSize += size;
        }
        if (chunk.length < 27 + pageSegments + totalSize)
            return false;
        let start = 27 + pageSegments;
        for (const size of sizes) {
            const segment = chunk.slice(start, start + size);
            if (this._head) {
                if (segment.compare(OPUS_TAGS, 0, 8, 0, 8) === 0)
                    this.emit('tags', segment);
                else if (this._bitstream === bitstream)
                    this.push(segment);
            }
            else if (segment.compare(OPUS_HEAD, 0, 8, 0, 8) === 0) {
                this.emit('head', segment);
                this._head = segment;
                this._bitstream = bitstream;
            }
            else {
                this.emit('unknownSegment', segment);
            }
            start += size;
        }
        return [undefined, chunk.slice(start)];
    }
    _destroy(err, cb) {
        this._cleanup();
        cb(err);
    }
    _final(cb) {
        this._cleanup();
        cb();
    }
    _cleanup() {
        this._remainder = undefined;
        this._head = undefined;
        this._bitstream = undefined;
    }
}
exports.OggDemuxer = OggDemuxer;
//# sourceMappingURL=OggDemuxer.js.map