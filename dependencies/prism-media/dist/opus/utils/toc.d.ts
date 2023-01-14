/**
 * Used to find the frame duration (in ms) of an Opus frame, given
 * its TOC byte value. For example, a TOC byte value of 0 would map
 * to FRAME_SIZE_MAP[0] = 10ms.
 *
 * See {@link https://tools.ietf.org/html/rfc6716#section-3.1}
 */
export declare const FRAME_SIZE_MAP: number[];
