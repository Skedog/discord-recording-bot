"use strict";
/* eslint-disable prettier/prettier */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRAME_SIZE_MAP = void 0;
/**
 * Used to find the frame duration (in ms) of an Opus frame, given
 * its TOC byte value. For example, a TOC byte value of 0 would map
 * to FRAME_SIZE_MAP[0] = 10ms.
 *
 * See {@link https://tools.ietf.org/html/rfc6716#section-3.1}
 */
exports.FRAME_SIZE_MAP = [
    10, 20, 40, 60,
    10, 20, 40, 60,
    10, 20, 40, 60,
    10, 20,
    10, 20,
    2.5, 5, 10, 20,
    2.5, 5, 10, 20,
    2.5, 5, 10, 20,
    2.5, 5, 10, 20, // config 28..31
];
//# sourceMappingURL=toc.js.map