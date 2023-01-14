/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from 'stream';
export declare enum VolumeTransformerType {
    S16LE = "s16le",
    S16BE = "s16be",
    S32LE = "s32le",
    S32BE = "s32be"
}
export interface VolumeTransformerConfig extends TransformOptions {
    type: VolumeTransformerType;
    volume?: number;
}
export declare class VolumeTransformer extends Transform {
    private buffer;
    private readonly bytes;
    private readonly extrema;
    readonly volume: number;
    constructor(config: VolumeTransformerConfig);
    private readInt;
    private writeInt;
    private clamp;
    _transform(newChunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
}
