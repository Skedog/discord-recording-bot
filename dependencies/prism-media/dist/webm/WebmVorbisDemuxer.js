"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebmVorbisDemuxer = exports.WebmVorbisDemuxer = void 0;
const WebmBaseDemuxer_1 = require("./WebmBaseDemuxer");
const VORBIS_HEAD = Buffer.from('vorbis');
class WebmVorbisDemuxer extends WebmBaseDemuxer_1.WebmBaseDemuxer {
    _checkHead(data) {
        if (data.readUInt8(0) !== 2 || data.compare(VORBIS_HEAD, 0, 6, 4, 10) !== 0) {
            return new Error('Audio codec is not Vorbis!');
        }
        const b1 = data.readUInt8(1);
        const b2 = data.readUInt8(2);
        this.push(data.slice(3, 3 + b1));
        this.push(data.slice(3 + b1, 3 + b1 + b2));
        this.push(data.slice(3 + b1 + b2));
    }
}
exports.WebmVorbisDemuxer = WebmVorbisDemuxer;
function createWebmVorbisDemuxer(options) {
    return new WebmVorbisDemuxer(options);
}
exports.createWebmVorbisDemuxer = createWebmVorbisDemuxer;
//# sourceMappingURL=WebmVorbisDemuxer.js.map