/// <reference types="node" />
import type { TransformCallback } from 'stream';
import { OpusStream, OpusStreamConfig } from './OpusStream';
export declare class Decoder extends OpusStream {
    opusHead?: Buffer;
    opusTags?: Buffer;
    constructor(options: OpusStreamConfig);
    _transform(chunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
    applyCTL(ctl: number, value: number): void;
}
