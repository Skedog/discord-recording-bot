/// <reference types="node" />
import type { TransformCallback } from 'stream';
import { OpusStream, OpusStreamConfig } from './OpusStream';
export declare class Encoder extends OpusStream {
    private buffer;
    constructor(options: OpusStreamConfig);
    _transform(newChunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
    applyCTL(ctl: number, value: number): void;
}
