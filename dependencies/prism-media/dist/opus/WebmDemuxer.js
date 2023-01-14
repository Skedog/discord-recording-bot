"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebmDemuxer = void 0;
const WebmBaseDemuxer_1 = require("../webm/WebmBaseDemuxer");
const OPUS_HEAD = Buffer.from('OpusHead');
class WebmDemuxer extends WebmBaseDemuxer_1.WebmBaseDemuxer {
    _checkHead(data) {
        if (data.compare(OPUS_HEAD, 0, 8, 0, 8) !== 0) {
            return new Error('Audio codec is not Opus!');
        }
    }
}
exports.WebmDemuxer = WebmDemuxer;
//# sourceMappingURL=WebmDemuxer.js.map