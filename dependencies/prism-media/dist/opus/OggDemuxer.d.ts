/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from 'stream';
export declare class OggDemuxer extends Transform {
    private _remainder?;
    private _bitstream?;
    private _head?;
    constructor(options?: TransformOptions);
    _transform(chunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
    private _readPage;
    _destroy(err: Error | null, cb: (error: Error | null) => void): void;
    _final(cb: (error?: Error) => void): void;
    _cleanup(): void;
}
