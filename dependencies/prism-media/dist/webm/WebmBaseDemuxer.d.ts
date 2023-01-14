/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from 'stream';
export declare type ParseResult = typeof TOO_SHORT | [
    undefined,
    {
        offset: number;
        _skipUntil?: number;
    }
] | [Error];
export declare abstract class WebmBaseDemuxer extends Transform {
    private _remainder?;
    private _length;
    private _count;
    private _ebmlFound;
    private _skipUntil?;
    private _incompleteTrack;
    private _track?;
    constructor(options?: TransformOptions);
    _transform(chunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
    private _readEBMLId;
    private _readTagDataSize;
    private _readTag;
    _destroy(err: Error | null, cb: (error: Error | null) => void): void;
    _final(cb: (error?: Error) => void): void;
    /**
     * Cleans up the demuxer when it is no longer required.
     * @private
     */
    _cleanup(): void;
    protected abstract _checkHead(buffer: Buffer): Error | undefined;
}
declare const TOO_SHORT: unique symbol;
export {};
